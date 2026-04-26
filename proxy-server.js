const express = require("express");

const app = express();

// Manually set CORS headers on every response
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("PAAL proxy v2 is running.");
});

app.post("/api/chat", async (req, res) => {
  try {
    console.log("Received request:", JSON.stringify(req.body).slice(0, 200));
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    console.log("Anthropic response status:", response.status);
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err.message);
    res.status(500).json({ error: "Proxy error", detail: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("PAAL proxy v2 started on port", process.env.PORT || 3000);
});
