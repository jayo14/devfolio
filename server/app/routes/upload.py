from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse

from app.storage import upload_bytes, get_object_stream, get_presigned_url

router = APIRouter(tags=["storage"])

ALLOWED_IMAGE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".avif"
}


@router.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    filename = file.filename or "upload.png"
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension '{ext}'. Allowed extensions: {', '.join(sorted(ALLOWED_IMAGE_EXTENSIONS))}",
        )

    content = await file.read()
    if len(content) > 15 * 1024 * 1024:  # 15 MB limit
        raise HTTPException(status_code=400, detail="File exceeds 15 MB limit")

    result = upload_bytes(
        data=content,
        filename=filename,
        content_type=file.content_type,
        folder="uploads",
    )

    return result


@router.get("/api/storage/{key:path}")
def serve_storage_file(key: str):
    obj = get_object_stream(key)
    if not obj:
        raise HTTPException(status_code=404, detail="File not found in storage")

    content_type = obj.get("ContentType", "application/octet-stream")
    body = obj["Body"]

    def iterfile():
        try:
            while chunk := body.read(64 * 1024):
                yield chunk
        finally:
            body.close()

    headers = {
        "Cache-Control": "public, max-age=86400, immutable",
    }
    if "ContentLength" in obj:
        headers["Content-Length"] = str(obj["ContentLength"])

    return StreamingResponse(iterfile(), media_type=content_type, headers=headers)


@router.get("/api/storage-url/{key:path}")
def get_file_url(key: str):
    url = get_presigned_url(key)
    return {"key": key, "presignedUrl": url}
