import dotenv from "dotenv";
import { MongoClient, Collection, Db } from "mongodb";
import path from "path";

// Carrega o .env da raiz do projeto
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME || "aulajs3";

if (!mongoUri) {
  console.error("MONGO_URI não definida no .env");
  process.exit(1);
}

const safeUri = mongoUri.replace(/(mongodb\+srv:\/\/[^:]+):[^@]+@/, "$1:****@");
console.log("Tentando conectar com URI:", safeUri);

const client = new MongoClient(mongoUri);

export let materialsCollection: Collection<any>;
export let productsCollection: Collection<any>;
export let categoriesCollection: Collection<any>;
export let suppliersCollection: Collection<any>;
export let inventoryCollection: Collection<any>;
export let db: Db;

export async function connectDatabase(): Promise<void> {
  try {
    await client.connect();
    db = client.db(dbName);

    // Inicializando todas as coleções
    materialsCollection = db.collection("materials");
    productsCollection = db.collection("products");
    categoriesCollection = db.collection("categories");
    suppliersCollection = db.collection("suppliers");
    inventoryCollection = db.collection("inventory");

    // Criando índices para melhor performance
    await createIndexes();

    console.log(`✅ MongoDB conectado com sucesso ao banco: ${dbName}`);
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB:", error);
    process.exit(1);
  }
}

async function createIndexes() {
  try {
    // Índices para materials
    await materialsCollection.createIndex({ name: 1 });
    await materialsCollection.createIndex({ sku: 1 }, { unique: true });
    await materialsCollection.createIndex({ category: 1 });
    
    // Índices para products
    await productsCollection.createIndex({ name: 1 });
    await productsCollection.createIndex({ sku: 1 }, { unique: true });
    await productsCollection.createIndex({ "materials.materialId": 1 });
    
    // Índices para categories
    await categoriesCollection.createIndex({ name: 1 }, { unique: true });
    
    // Índices para suppliers
    await suppliersCollection.createIndex({ cnpj: 1 }, { unique: true });
    await suppliersCollection.createIndex({ email: 1 });
    
    // Índices para inventory
    await inventoryCollection.createIndex({ productId: 1 }, { unique: true });
    await inventoryCollection.createIndex({ location: 1 });
    
    console.log("✅ Índices criados com sucesso");
  } catch (error) {
    console.error("⚠️ Erro ao criar índices:", error);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await client.close();
    console.log("MongoDB desconectado");
  } catch (error) {
    console.error("Erro ao desconectar MongoDB:", error);
  }
}