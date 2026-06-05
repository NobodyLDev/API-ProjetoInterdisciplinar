import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const config = {
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGO_URI || "",
  dbName: process.env.MONGO_DB_NAME || "API-ProjetoInterdisciplinar",
};