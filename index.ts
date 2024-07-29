import dotenv from "dotenv";
import app from "./app";
import { connectToDatabase } from "./db/dbUtil";

const ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: `.env.${ENV}`,
});

const PORT = process.env.PORT || 3000;

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[server]: Server is running on http://localhost:${PORT}`);
  });
});
