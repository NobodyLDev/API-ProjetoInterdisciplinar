// src/database.ts
import dotenv from "dotenv";
import { MongoClient, Collection } from "mongodb";
import path from "path";
import { config } from "../config/config";

// Carrega o .env a partir do diretório de trabalho do processo (raiz do projeto)
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const mongoUri = config.mongoUri;
const dbName = config.dbName;

if (!mongoUri) {
  console.error("MONGO_URI não definida no .env");
  process.exit(1);
}

const safeUri = mongoUri.replace(/(mongodb\+srv:\/\/[^:]+):[^@]+@/, "$1:****@");
console.log("Tentando conectar com URI:", safeUri); // Log sem senha

const client = new MongoClient(mongoUri);

export let materialsCollection: Collection<any>;
export let productsCollection: Collection<any>;

export async function connectDatabase(): Promise<void> {
  try {
    await client.connect();
    const db = client.db(dbName);

    materialsCollection = db.collection("materials");
    productsCollection = db.collection("products");

    console.log(`MongoDB conectado em ${dbName}`);
  } catch (error) {
    console.error("Erro ao conectar MongoDB:", error);
    process.exit(1);
  }
}