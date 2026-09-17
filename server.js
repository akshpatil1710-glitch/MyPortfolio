const express = require("express");
const path = require("path");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

// Resend client — set RESEND_API_KEY in your environment / Vercel settings
const resend = new Resend(process.env.RESEND_API_KEY);

// The email address where contact form messages will be delivered to
const TO_EMAIL = process.env.TO_EMAIL || "akshaypatil17101@gmail.com";

// The "from" address — must be a verified Resend domain.
// On the free tier with no custom domain, use: onboarding@resend.dev
const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Basic health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Akshay.dev API" });
});

// Receive contact messages and send via Resend
app.post("/api/contact", async (req, res) => {
  const name    = clean(req.body.name);
  const email   = clean(req.body.email);
  const subject = clean(req.body.subject);
  const message = clean(req.body.message);

  // Validate inputs
  const errors = {};
  if (!name)    errors.name    = "Name is required.";
  if (!email)   errors.email   = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!subject) errors.subject = "Subject is required.";
  if (!message) errors.message = "Message is required.";
  else if (message.length < 10) errors.message = "Message must be at least 10 characters.";

  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, errors });
  }

  // Check Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set.");
    return res.status(503).json({
      success: false,
      message: "Email service is not configured. Please try again later."
    });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #6c63ff; padding-bottom: 12px;">New Contact Form Message</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; width: 100px;">Name</td>
              <td style="padding: 10px 0; color: #1a1a1a;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #6c63ff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Subject</td>
              <td style="padding: 10px 0; color: #1a1a1a;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #1a1a1a; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">Sent from your portfolio contact form · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
        </div>
      `,
      text: `New contact form message\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent from your portfolio contact form.`
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again later."
      });
    }

    console.log("Email sent successfully. ID:", data?.id);
    res.status(201).json({
      success: true,
      message: "Your message was sent successfully! I'll get back to you soon."
    });

  } catch (err) {
    console.error("Unexpected error sending email:", err);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
  }
});

// Always serve the portfolio page for browser navigation.
app.get("/{*splat}", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "API route not found." });
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Akshay.dev running at http://localhost:${PORT}`);
});
