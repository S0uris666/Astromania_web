import dotenv from "dotenv";
import serverless from "serverless-http";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

dotenv.config();


let dbReady;
async function ensureDB() {
  if (!dbReady) dbReady = connectDB();
  return dbReady;
}

// Health siempre disponible
app.get("/api/health", (_req, res) => res.json({ ok: true, time: Date.now() }));

// Exporta el handler para Vercel
const handler = async (req, res) => {
  await ensureDB();
  const wrapped = serverless(app);
  return wrapped(req, res);
};

export default handler;