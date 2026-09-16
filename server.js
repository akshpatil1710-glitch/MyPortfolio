const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, "[]", "utf8");
}

function readMessages() {
  ensureStorage();
  try {
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf8");
}

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

// Receive contact messages
app.post("/api/contact", (req, res) => {
  const name = clean(req.body.name);
  const email = clean(req.body.email);
  const subject = clean(req.body.subject);
  const message = clean(req.body.message);

  const errors = {};
  if (!name) errors.name = "Name is required.";
  if (!email) errors.email = "Email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!subject) errors.subject = "Subject is required.";
  if (!message) errors.message = "Message is required.";
  else if (message.length < 10) errors.message = "Message must be at least 10 characters.";

  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, errors });
  }

  const messages = readMessages();
  const newMessage = {
    id: Date.now().toString(),
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString()
  };

  messages.push(newMessage);
  saveMessages(messages);

  res.status(201).json({
    success: true,
    message: "Your message was received successfully."
  });
});

// Simple admin API protected by an environment variable.
// Set ADMIN_KEY before using it.
app.get("/api/messages", (req, res) => {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    return res.status(503).json({
      success: false,
      message: "ADMIN_KEY is not configured on the server."
    });
  }

  if (req.get("x-admin-key") !== adminKey) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  res.json({ success: true, messages: readMessages() });
});

// Always serve the portfolio page for browser navigation.
app.get("/{*splat}", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ success: false, message: "API route not found." });
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

ensureStorage();

app.listen(PORT, () => {
  console.log(`Akshay.dev running at http://localhost:${PORT}`);
});
