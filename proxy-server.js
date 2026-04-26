const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["POST", "GET", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => res.send("PAAL proxy is running."));

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
  console.log("PAAL proxy server started.");
});
