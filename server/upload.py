import os
from pathlib import Path
import boto3
from dotenv import load_dotenv

SERVER_DIR = Path(__file__).resolve().parent
load_dotenv(SERVER_DIR / ".env")
load_dotenv()

region = os.environ.get("AWS_REGION", "eu-central-1")
endpoint_url = os.environ.get("AWS_ENDPOINT_URL_S3")
access_key = os.environ.get("AWS_ACCESS_KEY_ID")
secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY")

s3 = boto3.client(
    "s3",
    region_name=region,
    endpoint_url=endpoint_url,
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key,
)
bucket = "assets"
key = "uploads/file.txt"

try:
    s3.create_bucket(Bucket=bucket)
except Exception:
    pass

s3.put_object(Bucket=bucket, Key=key, Body="Hello World!")

url = s3.generate_presigned_url("get_object", Params={"Bucket": bucket, "Key": key}, ExpiresIn=3600)
print(f"[view] {url}")
