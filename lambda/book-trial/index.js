const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({ region: process.env.AWS_REGION || "ap-southeast-2" });

const TO_EMAIL = process.env.TO_EMAIL || "kando@knoxmartialarts.com.au";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@knoxmartialarts.com.au";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

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
  // Try JSON first, then form encoded
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

async function sendTrialEmail(data) {
  const { firstName, lastName, email, mobile, program, source } = normalizeFormData(data);

  if (!firstName || !lastName || !email || !mobile) {
    throw new Error("Missing required fields: first-name, last-name, email, mobile");
  }

  const subject = `[Trial Request] ${firstName} ${lastName} - ${program || "Kando Martial Arts"}`;
  const bodyText = `
New trial booking request from the website:

Name: ${firstName} ${lastName}
Email: ${email}
Mobile: ${mobile}
${program ? `Program: ${program}` : ""}
${source ? `Source: ${source}` : ""}

---
Submitted at: ${new Date().toISOString()}
  `.trim();

  const bodyHtml = `
    <h2>New Trial Booking Request</h2>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Mobile:</strong> ${mobile}</p>
    ${program ? `<p><strong>Program:</strong> ${program}</p>` : ""}
    ${source ? `<p><strong>Source:</strong> ${source}</p>` : ""}
    <hr>
    <p style="color:#666;font-size:12px;">Submitted at: ${new Date().toISOString()}</p>
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
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    if (method !== "POST") {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: "Method not allowed" }),
      };
    }

    const contentType = event.headers?.["content-type"] || event.headers?.["Content-Type"];
    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    const data = parseBody(body, contentType);

    await sendTrialEmail(data);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Thank you! We'll be in touch soon." }),
    };
  } catch (err) {
    console.error("Trial form error:", err);
    return {
      statusCode: err.name === "ValidationError" ? 400 : 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: err.message || "Failed to submit trial request",
      }),
    };
  }
};
