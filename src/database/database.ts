import dotenv from "dotenv";
import { MongoClient, Collection } from "mongodb";
import path from "path";
import { config } from "../config/config";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const mongoUri = config.mongoUri;
const dbName = config.dbName;

if (!mongoUri) {
  console.error("MONGO_URI não definida no .env");
  process.exit(1);
}

const safeUri = mongoUri.replace(/(mongodb\+srv:\/\/[^:]+):[^@]+@/, "$1:****@");
console.log("Tentando conectar com URI:", safeUri);

const client = new MongoClient(mongoUri);

export let materialsCollection: Collection<any>;
export let productsCollection: Collection<any>;
export let historyCollection: Collection<any>;

export async function connectDatabase(): Promise<void> {
  try {
    await client.connect();
    const db = client.db(dbName);

    materialsCollection = db.collection("materials");
    productsCollection = db.collection("products");
    historyCollection = db.collection("history");

    console.log(`MongoDB conectado em ${dbName}`);
  } catch (error) {
    console.error("Erro ao conectar MongoDB:", error);
    process.exit(1);
  }
}