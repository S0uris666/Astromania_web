
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

let dbConnectionPromise;
const ensureDBConnection = () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }
  return dbConnectionPromise;
};

export default async function handler(req, res) {
  await ensureDBConnection();
  return app(req, res);
}

if (process.env.NODE_ENV !== "production") {
  ensureDBConnection().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  });
}
