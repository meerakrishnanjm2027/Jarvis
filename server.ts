import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy Gemini Client setup
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // --- API Routes ---

  // Health and System Status
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Gemini Chat & Structured Intent classification route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, systemInstruction, temperature } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message prompt is required" });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.status(503).json({
          error: "Gemini API key is not configured in the environment.",
          code: "GEMINI_NOT_CONFIGURED",
        });
      }

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message,
        config: {
          systemInstruction:
            systemInstruction ||
            "You are JARVIS, an advanced AI Assistant. Provide helpful, concise, and structured answers.",
          temperature: typeof temperature === "number" ? temperature : 0.3,
        },
      });

      res.json({
        text: response.text || "",
        success: true,
      });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({
        error: err?.message || "Error communicating with Gemini model",
        success: false,
      });
    }
  });

  // Retrieve files from Mark-LIV-main directory for inspection
  app.get("/api/project/files", (_req, res) => {
    try {
      const baseDir = path.join(process.cwd(), "Mark-LIV-main");
      if (!fs.existsSync(baseDir)) {
        return res.json({ files: [] });
      }

      function scanDir(dir: string, relPath = ""): any[] {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const result: any[] = [];

        for (const entry of entries) {
          const currentRel = relPath ? `${relPath}/${entry.name}` : entry.name;
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            result.push({
              name: entry.name,
              path: currentRel,
              type: "directory",
              children: scanDir(fullPath, currentRel),
            });
          } else {
            let content = "";
            try {
              content = fs.readFileSync(fullPath, "utf-8");
            } catch {
              content = "[binary or unreadable]";
            }
            result.push({
              name: entry.name,
              path: currentRel,
              type: "file",
              content,
            });
          }
        }
        return result;
      }

      const files = scanDir(baseDir);
      res.json({ files });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JARVIS Server running on port ${PORT}`);
  });
}

startServer();
