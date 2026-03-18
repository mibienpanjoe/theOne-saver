require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const RAPIDAPI_HOST = "instagram-downloader-download-instagram-videos-stories.p.rapidapi.com";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/proxy-image", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send("No URL provided");
  
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    });
    
    // Pass headers
    res.set('Content-Type', response.headers['content-type']);
    res.set('Cache-Control', 'public, max-age=31536000');
    
    // Pipe the image data
    response.data.pipe(res);
  } catch (err) {
    console.error("Error proxying image:", err.message);
    // Return a simple SVG placeholder on failure
    res.set('Content-Type', 'image/svg+xml');
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="284" fill="#334155"><rect width="160" height="284" rx="12"/><text x="80" y="142" text-anchor="middle" fill="#94a3b8" font-size="14" font-family="sans-serif">No Preview</text></svg>`);
  }
});

app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

  try {
    const response = await axios.get(videoUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const contentType = response.headers['content-type'] || 'video/mp4';
    const filename = `instagram_video_${Date.now()}.mp4`;

    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    if (response.headers['content-length']) {
      res.set('Content-Length', response.headers['content-length']);
    }

    response.data.pipe(res);
  } catch (err) {
    console.error("Error downloading video:", err.message);
    res.status(500).json({ error: "Failed to download video" });
  }
});

app.post("/api/video-info", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const options = {
    method: "GET",
    url: `https://${RAPIDAPI_HOST}/unified/url`,
    params: {
      url: url,
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(options);
    
    if (response.data && response.data.data && response.data.data.content) {
      const content = response.data.data.content;
      const maindata = content.media_url;
      // Try multiple fields for thumbnail
      const thumbnail = content.thumbnail_url || content.thumbnail || content.cover || null;
      const title = response.data.data.title || "Instagram Video";

      return res.json({
        title,
        thumbnail,
        video_url: maindata
      });
    } else {
        return res.status(500).json({ error: "Invalid response from API", details: response.data });
    }
  } catch (err) {
    console.error("Error fetching video info:", err);
    return res.status(500).json({ error: "Failed to fetch video information" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});