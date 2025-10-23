import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Routers
import eventRouter from "./routes/event.route.js";
import userRouter from "./routes/user.routes.js";
import contactRouter from "./routes/contact.route.js";
import paymentRouter from "./routes/payment.route.js";
import serviceProductRouter from "./routes/service.product.route.js";
import routerCloudinary from "./routes/image.route.js";

app.set("trust proxy", 1);

// --- CORS (whitelist + patrón Vercel) ---
const staticOrigins = new Set([
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://astromania-web-nsgx.vercel.app",
  "https://astromania-web-nine.vercel.app",
]);
const vercelPattern = /^https:\/\/astromania-web-[\w-]+\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-to-server / curl
    if (staticOrigins.has(origin) || vercelPattern.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Aplica CORS a todo
app.use(cors(corsOptions));

app.options("/api/(.*)", cors(corsOptions));

// Body & cookies
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "backend", ts: Date.now() });
});

// Rutas
app.get("/", (_req, res) => {
  res.send("Backend funcionando!");
});

app.use("/api", contactRouter);
app.use("/api/payments", paymentRouter);
app.use("/api", userRouter);
app.use("/api", eventRouter);
app.use("/api", serviceProductRouter);
app.use("/api", routerCloudinary);

// Manejo de errores (incluye errores de CORS)
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err?.message || err);
 
  if (err?.message === "CORS origin not allowed") {
    
    if (req.headers.origin && (staticOrigins.has(req.headers.origin) || vercelPattern.test(req.headers.origin))) {
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    return res.status(403).json({ message: "CORS: origin not allowed" });
  }

  return res.status(500).json({
    message: "Server error",
    detail: err?.message || "Unexpected error",
  });
});

export default app;