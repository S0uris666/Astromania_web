import axios from "axios";

const resolveBaseURL = () => {
  const envValue = (import.meta.env.VITE_BACKEND_URL || "").trim();
  const normalizedEnv =
    envValue && envValue !== "/"
      ? envValue.replace(/\/+$/, "")
      : "";
  const isEnvLocal = normalizedEnv.includes("localhost");
  const isServer = typeof window === "undefined";

  if (isServer) {
    // During SSR/build we can't inspect window, so prefer a non-local env URL.
    return normalizedEnv && !isEnvLocal ? normalizedEnv : "/api";
  }

  const hostname = window.location.hostname;
  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]";

  if (isLocalHost) {
    // Local dev keeps .env override or falls back to the local backend.
    return normalizedEnv || "http://localhost:3000/api";
  }

  // Production: ignore local URLs accidentally committed to .env files.
  if (normalizedEnv && !isEnvLocal) {
    return normalizedEnv;
  }

  // Default to same-origin /api so Vercel rewrites can forward the call.
  return "/api";
};

export const API_BASE_URL = resolveBaseURL();

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default client;
