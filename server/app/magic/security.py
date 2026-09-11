import ipaddress
import re
import socket
from urllib.parse import urlparse


class ValidationError(Exception):
    pass


def validate_and_normalize_github_url(url: str) -> tuple[str, str, str]:
    """Validates a GitHub repository URL and extracts (normalized_url, owner, repo)."""
    if not url or not isinstance(url, str):
        raise ValidationError("GitHub repository URL is required.")

    cleaned = url.strip()
    if not cleaned.startswith(("http://", "https://")):
        cleaned = f"https://{cleaned}"

    parsed = urlparse(cleaned)
    if parsed.netloc.lower() not in ("github.com", "www.github.com"):
        raise ValidationError("Only github.com repository URLs are supported.")

    parts = [p for p in parsed.path.strip("/").split("/") if p]
    if len(parts) < 2:
        raise ValidationError(
            "Invalid GitHub URL format. Expected: https://github.com/owner/repository"
        )

    owner = parts[0]
    repo = parts[1].replace(".git", "")

    # Validate owner and repo names according to GitHub specs
    if not re.match(r"^[a-zA-Z0-9_\-\.]+$", owner) or not re.match(
        r"^[a-zA-Z0-9_\-\.]+$", repo
    ):
        raise ValidationError("GitHub repository owner or name contains invalid characters.")

    normalized_url = f"https://github.com/{owner}/{repo}"
    return normalized_url, owner, repo


def validate_public_website_url(url: str) -> str:
    """Validates that a website URL is well-formed and does not resolve to private,

    internal, loopback, or reserved network addresses (anti-SSRF guard).
    """
    if not url or not isinstance(url, str):
        raise ValidationError("Website URL is required.")

    cleaned = url.strip()
    if not cleaned.startswith(("http://", "https://")):
        cleaned = f"https://{cleaned}"

    parsed = urlparse(cleaned)
    if parsed.scheme not in ("http", "https"):
        raise ValidationError("Website URL must use HTTP or HTTPS protocol.")

    hostname = parsed.hostname
    if not hostname:
        raise ValidationError("Invalid website hostname.")

    # Block common internal names
    lower_host = hostname.lower()
    if lower_host in (
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "metadata.google.internal",
        "instance-data",
    ) or lower_host.endswith((".local", ".internal", ".localhost")):
        raise ValidationError(
            f"Access to private/internal network address '{hostname}' is not permitted."
        )

    # DNS resolution check for IP-level SSRF prevention
    try:
        resolved_ips = socket.getaddrinfo(hostname, None)
        for entry in resolved_ips:
            ip_str = entry[4][0]
            ip_obj = ipaddress.ip_address(ip_str)

            if (
                ip_obj.is_private
                or ip_obj.is_loopback
                or ip_obj.is_link_local
                or ip_obj.is_reserved
                or ip_obj.is_multicast
            ):
                raise ValidationError(
                    f"Access to private or non-routable IP address '{ip_str}' is forbidden."
                )
    except socket.gaierror:
        raise ValidationError(f"Could not resolve website host '{hostname}'. Check that the URL is live.")

    return cleaned
