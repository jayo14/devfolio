import os
import re
import uuid
import mimetypes
from pathlib import Path
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError

SERVER_DIR = Path(__file__).resolve().parent.parent
load_dotenv(SERVER_DIR / ".env")
load_dotenv()

DEFAULT_BUCKET = os.getenv("NEON_STORAGE_BUCKET", os.getenv("AWS_S3_BUCKET", "assets"))
REGION_NAME = os.getenv("AWS_REGION", "eu-central-1")
ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL_S3")
ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")


def get_s3_client():
    return boto3.client(
        "s3",
        region_name=REGION_NAME,
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
    )


def ensure_bucket_exists(bucket: str = DEFAULT_BUCKET):
    s3 = get_s3_client()
    try:
        s3.head_bucket(Bucket=bucket)
    except ClientError:
        try:
            s3.create_bucket(Bucket=bucket)
        except Exception:
            pass


def sanitize_filename(filename: str) -> str:
    clean = re.sub(r"[^a-zA-Z0-9_.-]", "_", filename).strip("_")
    return clean or "file.bin"


def upload_bytes(
    data: bytes,
    filename: str,
    content_type: str | None = None,
    folder: str = "uploads",
    bucket: str = DEFAULT_BUCKET,
) -> dict:
    ensure_bucket_exists(bucket)
    s3 = get_s3_client()

    clean_name = sanitize_filename(filename)
    unique_prefix = uuid.uuid4().hex[:8]
    key = f"{folder}/{unique_prefix}_{clean_name}"

    if not content_type:
        guessed_type, _ = mimetypes.guess_type(filename)
        content_type = guessed_type or "application/octet-stream"

    s3.put_object(
        Bucket=bucket,
        Key=key,
        Body=data,
        ContentType=content_type,
    )

    presigned_url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=3600 * 24 * 7,  # 7 days
    )

    return {
        "key": key,
        "bucket": bucket,
        "contentType": content_type,
        "size": len(data),
        "url": f"/api/storage/{key}",
        "presignedUrl": presigned_url,
    }


def get_object_stream(key: str, bucket: str = DEFAULT_BUCKET):
    s3 = get_s3_client()
    try:
        resp = s3.get_object(Bucket=bucket, Key=key)
        return resp
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code")
        if error_code in ("NoSuchKey", "404"):
            return None
        raise e


def get_presigned_url(key: str, expires_in: int = 3600 * 24 * 7, bucket: str = DEFAULT_BUCKET) -> str:
    s3 = get_s3_client()
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=expires_in,
    )
