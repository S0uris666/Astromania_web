import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

//rutas
import eventRouter from "./routes/event.route.js";
import userRouter from "./routes/user.routes.js";
import contactRouter from "./routes/contact.route.js";
import paymentRouter from "./routes/payment.route.js";
import serviceProductRouter from "./routes/service.product.route.js";
import routerCloudinary from "./routes/image.route.js";

app.set("trust proxy", 1);

const staticOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://astromania-web-nsgx.vercel.app",
  "https://astromania-web-nine.vercel.app",
];

const vercelPattern = /^https:\/\/astromania-web-[\w-]+\.vercel\.app$/i;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (staticOrigins.includes(origin) || vercelPattern.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

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

app.options("*", cors(corsOptions));

export default app;
