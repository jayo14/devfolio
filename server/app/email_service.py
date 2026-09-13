import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from dotenv import load_dotenv
import httpx

SERVER_DIR = Path(__file__).resolve().parent.parent
load_dotenv(SERVER_DIR / ".env")
load_dotenv()

DEFAULT_RECIPIENT = os.getenv("CONTACT_NOTIFICATION_EMAIL", "johnayobami77@proton.me")


def send_contact_email(
    first_name: str,
    last_name: str,
    email: str,
    phone: str,
    message: str,
    recipient: str | None = None,
) -> dict:
    """Sends a notification email for a contact form submission using the best available provider."""
    target_recipient = (recipient or os.getenv("CONTACT_NOTIFICATION_EMAIL") or DEFAULT_RECIPIENT).strip()
    full_name = f"{first_name} {last_name}".strip()
    subject = f"[Devfolio] New Contact Message from {full_name}"

    text_body = f"""You received a new inquiry from your Devfolio portfolio:

Name: {full_name}
Email: {email}
Phone: {phone}

Message:
{message or '(No message provided)'}

---
Reply directly to this email to respond to {full_name} ({email}).
"""

    html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px; color: #111; }}
    .card {{ max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e5e5; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
    .header {{ background: #000000; color: #ffffff; padding: 24px; border-bottom: 2px solid #ff4f22; }}
    .header h2 {{ margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }}
    .content {{ padding: 24px; }}
    .field {{ margin-bottom: 16px; }}
    .label {{ font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666666; margin-bottom: 4px; font-weight: 600; }}
    .value {{ font-size: 15px; color: #111111; }}
    .message-box {{ background: #fafafa; border-left: 3px solid #ff4f22; padding: 16px; margin-top: 20px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }}
    .footer {{ padding: 16px 24px; background: #fafafa; border-top: 1px solid #eeeeee; font-size: 12px; color: #888888; text-align: center; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>New Contact Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From</div>
        <div class="value"><strong>{full_name}</strong> &lt;{email}&gt;</div>
      </div>
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">{phone}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">{message or '(No message provided)'}</div>
      </div>
    </div>
    <div class="footer">
      Sent from your Devfolio Portfolio Contact Form • Reply directly to this email to reach {full_name}
    </div>
  </div>
</body>
</html>
"""

    delivery_status = "unconfigured"
    delivery_error = None

    # 1. Try Resend if configured
    resend_key = os.getenv("RESEND_API_KEY", "").strip()
    if resend_key:
        from_email = os.getenv("RESEND_FROM", "Devfolio <onboarding@resend.dev>").strip()
        try:
            import resend

            resend.api_key = resend_key
            resp = resend.Emails.send({
                "from": from_email,
                "to": [target_recipient],
                "reply_to": email,
                "subject": subject,
                "text": text_body,
                "html": html_body,
            })
            email_id = resp.get("id") if isinstance(resp, dict) else getattr(resp, "id", None)
            return {
                "delivered": True,
                "provider": "resend",
                "id": email_id,
                "recipient": target_recipient,
            }
        except Exception as e:
            # Fallback to direct HTTP post if SDK encounter issues
            try:
                res = httpx.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {resend_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": from_email,
                        "to": [target_recipient],
                        "reply_to": email,
                        "subject": subject,
                        "text": text_body,
                        "html": html_body,
                    },
                    timeout=10.0,
                )
                if res.status_code in (200, 201):
                    data = res.json()
                    return {
                        "delivered": True,
                        "provider": "resend",
                        "id": data.get("id"),
                        "recipient": target_recipient,
                    }
                delivery_error = f"Resend API error ({res.status_code}): {res.text}"
            except Exception as http_e:
                delivery_error = f"Resend SDK error: {e}; HTTP fallback error: {http_e}"


    # 2. Try SMTP if configured
    smtp_host = os.getenv("SMTP_HOST")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    if smtp_host and smtp_user and smtp_pass:
        try:
            port = int(os.getenv("SMTP_PORT", "587"))
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = os.getenv("SMTP_FROM", smtp_user)
            msg["To"] = target_recipient
            msg["Reply-To"] = email
            msg.set_content(text_body)
            msg.add_alternative(html_body, subtype="html")

            if port == 465:
                with smtplib.SMTP_SSL(smtp_host, port, timeout=10) as server:
                    server.login(smtp_user, smtp_pass)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(smtp_host, port, timeout=10) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_pass)
                    server.send_message(msg)

            return {"delivered": True, "provider": "smtp"}
        except Exception as e:
            delivery_error = f"SMTP error: {e}"

    # 3. Try Formspree if configured
    formspree_id = os.getenv("FORMSPREE_FORM_ID")
    if formspree_id:
        try:
            url = f"https://formspree.io/f/{formspree_id}"
            res = httpx.post(
                url,
                json={
                    "name": full_name,
                    "email": email,
                    "phone": phone,
                    "message": message,
                    "_replyto": email,
                    "_subject": subject,
                },
                headers={"Accept": "application/json"},
                timeout=10.0,
            )
            if res.status_code in (200, 201):
                return {"delivered": True, "provider": "formspree"}
            delivery_error = f"Formspree error ({res.status_code}): {res.text}"
        except Exception as e:
            delivery_error = f"Formspree exception: {e}"

    # Return status with log
    return {
        "delivered": False,
        "provider": None,
        "recipient": target_recipient,
        "note": "Message recorded in database. To enable automated email dispatch, add SMTP_HOST/USER/PASSWORD or RESEND_API_KEY to server/.env",
        "error": delivery_error,
    }

