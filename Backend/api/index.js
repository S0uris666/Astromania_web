// Backend/api/index.js
import dotenv from "dotenv";
import serverless from "serverless-http";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

dotenv.config();



app.get("/api/health", (_req, res) => res.json({ ok: true, where: "express", ts: Date.now() }));
app.get("/api/ping",   (_req, res) => res.json({ ok: true, where: "express", ts: Date.now() }));

let dbReady;
async function ensureDB() {
  if (!dbReady) {
    dbReady = connectDB().catch((e) => {
      console.error("DB connect error:", e?.message || e);
      throw e;
    });
  }
  return dbReady;
}

const expressHandler = serverless(app);

export default async function handler(req, res) {
  // Deja pasar health/ping sin DB
  if (req.url?.startsWith("/api/health") || req.url?.startsWith("/api/ping")) {
    return expressHandler(req, res);
  }
  await ensureDB();
  return expressHandler(req, res);
}
