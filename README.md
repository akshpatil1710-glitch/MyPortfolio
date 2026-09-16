# Akshay.dev — Full-Stack Personal Portfolio

A responsive personal portfolio for **Akshay Patil** with a plain HTML/CSS/JavaScript frontend and a Node.js + Express backend.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- Express.js
- JSON file storage for development/demo use

## Features

### Frontend
- Dark + neon orange UI
- Sticky responsive navbar
- Mobile hamburger navigation
- Smooth scrolling
- Active section indicator
- Animated hero gradient and profile glow
- Responsive project/skills cards
- Scroll reveal animations
- Accessibility basics
- Reduced-motion support
- Client-side form validation

### Backend
- Express server
- `POST /api/contact` contact endpoint
- Server-side validation
- Contact messages stored in `data/messages.json`
- `GET /api/health` health check
- Protected `GET /api/messages` endpoint using `ADMIN_KEY`
- Static frontend served by the same Node server

> JSON storage is appropriate for a beginner/demo portfolio. For production, replace it with a database such as PostgreSQL, MySQL or MongoDB.

## Folder Structure

```text
portfolio/
├── index.html
├── style.css
├── script.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── data/
│   └── messages.json
└── assets/
    ├── profile.jpg
    ├── project1.jpg
    ├── project2.jpg
    ├── project3.jpg
    ├── project4.jpg
    └── README.txt
```

## Run Locally

### 1. Install Node.js

Install a current LTS version of Node.js.

### 2. Open the project

```bash
cd portfolio
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the backend

```bash
npm start
```

The website will be available at:

```text
http://localhost:3000
```

Do not open `index.html` directly when testing the contact form. Open the website through the Node server so `/api/contact` is available.

### Development mode

```bash
npm run dev
```

## Test the Backend

Open:

```text
http://localhost:3000/api/health
```

You should receive JSON similar to:

```json
{
  "ok": true,
  "service": "Akshay.dev API"
}
```

Submit the contact form and check:

```text
data/messages.json
```

The submitted messages will be stored there.

## Admin Messages Endpoint

For local testing, set an environment variable:

### Windows PowerShell

```powershell
$env:ADMIN_KEY="your-long-secret"
npm start
```

Then request:

```text
GET /api/messages
```

with this HTTP header:

```text
x-admin-key: your-long-secret
```

Never expose the admin key in frontend JavaScript.

## Production Backend

For a real public portfolio, JSON-file storage should be replaced with a managed database and/or email notification service.

Recommended production improvements:

1. Use PostgreSQL/MySQL/MongoDB instead of `data/messages.json`.
2. Add rate limiting.
3. Add spam protection/CAPTCHA if needed.
4. Add email notifications through a trusted email provider.
5. Keep secrets in environment variables.
6. Use HTTPS.
7. Add stronger request-size and abuse controls.
8. Do not expose stored messages publicly.

## Replace Images

Replace:

```text
assets/profile.jpg
assets/project1.jpg
assets/project2.jpg
assets/project3.jpg
assets/project4.jpg
```

with your real images.

## Resume

Place your real resume at:

```text
assets/resume.pdf
```

The Resume buttons already point there.

## Social Links

Current links:

- GitHub: https://github.com/akshpatil1710-glitch
- LinkedIn: https://www.linkedin.com/in/akshay-patil-1993b4330

Only add real project GitHub/live-demo URLs.

## GitHub Pages Important Note

The original frontend-only version can be hosted directly on GitHub Pages.

**This backend version cannot run on GitHub Pages**, because GitHub Pages serves static files and does not run Node.js/Express servers.

For the full-stack version, deploy the frontend + Express server to a Node-compatible hosting provider, or deploy the frontend separately and host the API on a backend platform.

If the frontend and backend are deployed on different domains, change the frontend `fetch("/api/contact")` URL to your deployed API URL and configure CORS on the Express server.

## Evaluation Explanation

### Design Choice
Dark + neon orange gives a professional developer appearance while making important actions and headings easy to notice.

### Layout
The website follows:

`Hero → About → Skills → Projects → Contact → Footer`

This gives visitors a clear journey from introduction to skills, work and contact.

### Responsiveness
CSS Grid, flexible widths and media queries adapt the website for desktop, tablet and mobile. The navbar becomes a hamburger menu on smaller screens.

### JavaScript
JavaScript handles the mobile menu, active navigation, scroll animations, back-to-top button, client-side validation and asynchronous contact-form submission.

### Backend
Node.js runs the server and Express provides the API. When the form is submitted, the browser sends JSON to `POST /api/contact`. The server validates the data and stores the message.

### Frontend Structure
- `index.html` → structure/content
- `style.css` → design/responsiveness
- `script.js` → browser interactions + API request
- `server.js` → backend/API
- `data/messages.json` → development message storage
- `assets/` → images/resume
