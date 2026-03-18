<p align="center">
  <img src="public/icons/icon-192.png" width="96" alt="TheOne Saver Logo">
</p>

<h1 align="center">TheOne Saver</h1>
<p align="center">
  <strong>Download Instagram Videos & Reels Instantly</strong>
</p>
<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#license">License</a>
</p>

---

## Features

- 🎬 **Instant Video Download** — Paste any Instagram Reel or Video URL and download it directly to your device
-  **Paste from Clipboard** — One-click paste button to quickly input links
-  **Video Preview** — See the video thumbnail before downloading
-  **Installable PWA** — Add to your home screen and use it like a native app
- **Dark Mode UI** — Sleek glassmorphic design with smooth animations
- **Fully Responsive** — Works seamlessly on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [RapidAPI](https://rapidapi.com/) account with access to the [Instagram Downloader API](https://rapidapi.com/instagram-downloader-download-instagram-videos-stories/api/instagram-downloader-download-instagram-videos-stories)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mibienpanjoe/theOne-saver.git
   cd theOne-saver
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

4. **Start the server**

   ```bash
   npm start
   ```

5. Open your browser at **http://localhost:3000**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express 5 |
| **Frontend** | Vanilla HTML, CSS, JavaScript |
| **API** | [Instagram Downloader](https://rapidapi.com/instagram-downloader-download-instagram-videos-stories/api/instagram-downloader-download-instagram-videos-stories) via RapidAPI |
| **HTTP Client** | Axios |
| **PWA** | Service Worker, Web App Manifest |
| **Design** | Glassmorphism, Inter font, CSS animations |

## Project Structure

```
theOne-saver/
├── index.js                 # Express server + API routes
├── package.json
├── .env                     # Environment variables (not committed)
├── .gitignore
└── public/                  # Static frontend assets
    ├── index.html           # Main HTML page
    ├── app.js               # Frontend logic
    ├── style.css            # Styles (dark mode, glassmorphism)
    ├── manifest.json        # PWA manifest
    ├── sw.js                # Service worker (cache-first)
    └── icons/
        ├── icon-192.png     # PWA icon (192×192)
        └── icon-512.png     # PWA icon (512×512)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/video-info` | Fetch video metadata (title, thumbnail, download URL) |
| `GET` | `/api/download?url=` | Proxy video download with attachment headers |
| `GET` | `/api/proxy-image?url=` | Proxy image to bypass hotlink protection |

## How It Works

1. User pastes an Instagram Reel/Video URL
2. The server calls the Instagram Downloader API to get video metadata
3. A thumbnail preview is shown via the image proxy
4. User clicks "Download Video" → server streams the video with `Content-Disposition: attachment` → file saves directly to Downloads

## License

ISC
