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
      const maindata = response.data.data.content.media_url;
      const thumbnail = response.data.data.content.thumbnail_url;
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