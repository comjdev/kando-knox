const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({ region: process.env.AWS_REGION || "ap-southeast-2" });

const TO_EMAIL = process.env.TO_EMAIL || "knox@kandomartialarts.com.au";
const FROM_EMAIL = process.env.FROM_EMAIL || "kando@knoxmartialarts.com.au";

// Don't add CORS headers - Lambda Function URL CORS config handles them.
// Duplicate Access-Control-* headers cause "multiple values" CORS errors.
const jsonHeaders = { "Content-Type": "application/json" };

function parseBody(body, contentType) {
  if (!body) return {};
  if (contentType?.includes("application/json")) {
    try {
      return typeof body === "string" ? JSON.parse(body) : body;
    } catch {
      return {};
    }
  }
  if (contentType?.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(body));
  }
  try {
    const parsed = typeof body === "string" ? JSON.parse(body) : body;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {}
  try {
    return Object.fromEntries(new URLSearchParams(body));
  } catch {
    return {};
  }
}

function normalizeKey(key) {
  return key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function normalizeFormData(data) {
  const result = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    const key = normalizeKey(k);
    result[key] = typeof v === "string" ? v.trim() : String(v);
  }
  return result;
}

async function sendContactEmail(data) {
  const { firstName, lastName, email, phoneNumber, message } = normalizeFormData(data);

  if (!firstName || !lastName || !email) {
    throw new Error("Missing required fields: first-name, last-name, email");
  }

  const subject = `[Contact Form] ${firstName} ${lastName} - Website enquiry`;
  const bodyText = `
New contact form submission from the website:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phoneNumber || "Not provided"}

Message:
${message || "No message provided"}

---
Submitted at: ${new Date().toISOString()}
  `.trim();

  const bodyHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;background:#f3f4f6;">
  <div style="max-width:560px;margin:0 auto;padding:32px;background:#ffffff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <h2 style="margin:0 0 24px 0;padding-bottom:12px;font-size:20px;font-weight:600;color:#111827;border-bottom:3px solid #c39519;">New Contact Form Submission</h2>
    <p style="margin:0 0 12px 0;font-size:15px;line-height:1.5;"><strong style="color:#374151;">Name:</strong> ${firstName} ${lastName}</p>
    <p style="margin:0 0 12px 0;font-size:15px;line-height:1.5;"><strong style="color:#374151;">Email:</strong> <a href="mailto:${email}" style="color:#c39519;text-decoration:none;">${email}</a></p>
    <p style="margin:0 0 12px 0;font-size:15px;line-height:1.5;"><strong style="color:#374151;">Phone:</strong> ${phoneNumber || "Not provided"}</p>
    <h3 style="margin:20px 0 8px 0;font-size:16px;font-weight:600;color:#111827;">Message</h3>
    <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#374151;">${(message || "No message provided").replace(/\n/g, "<br>")}</p>
    <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
    <p style="margin:0;font-size:12px;color:#6b7280;">Submitted at: ${new Date().toISOString()}</p>
    <p style="margin:8px 0 0 0;font-size:12px;color:#6b7280;">Kando Martial Arts Knox</p>
  </div>
</body>
</html>
  `;

  await ses.send(
    new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [TO_EMAIL] },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Text: { Data: bodyText, Charset: "UTF-8" },
          Html: { Data: bodyHtml, Charset: "UTF-8" },
        },
      },
      ReplyToAddresses: [email],
    })
  );
}

function getMethod(event) {
  return event.requestContext?.http?.method || event.httpMethod;
}

exports.handler = async (event) => {
  const method = getMethod(event);
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: jsonHeaders, body: "" };
  }

  try {
    if (method !== "POST") {
      return {
        statusCode: 405,
        headers: jsonHeaders,
        body: JSON.stringify({ success: false, error: "Method not allowed" }),
      };
    }

    const contentType = event.headers?.["content-type"] || event.headers?.["Content-Type"];
    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    const data = parseBody(body, contentType);

    await sendContactEmail(data);

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ success: true, message: "Thank you! We'll be in touch soon." }),
    };
  } catch (err) {
    console.error("Contact form error:", err);
    return {
      statusCode: err.name === "ValidationError" ? 400 : 500,
      headers: jsonHeaders,
      body: JSON.stringify({
        success: false,
        error: err.message || "Failed to send message",
      }),
    };
  }
};
