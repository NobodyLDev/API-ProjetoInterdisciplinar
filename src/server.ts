import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import materialsRoutes from "./routes/materialRoutes";
import productsRoutes from "./routes/productRoutes";
import simulationRoutes from "./routes/simulationRoutes";
import historyRoutes from "./routes/historyRoutes";
import { connectDatabase } from "./database/database";

const app = express();

// Middleware de CORS personalizado (mantendo seu estilo original)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Middlewares adicionais para segurança e performance
app.use(helmet()); // Segurança para headers HTTP
app.use(express.json()); // Parse de JSON
app.use(express.urlencoded({ extended: true })); // Parse de URL encoded

// Rate limiting para evitar abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: "Muitas requisições deste IP, tente novamente mais tarde"
});
app.use("/api", limiter);

// Rotas da API (prefixo opcional)
app.use("/materials", materialsRoutes);
app.use("/products", productsRoutes);
app.use("/simulate", simulationRoutes);
app.use("/history", historyRoutes);

// Rota de health check
app.get("/health", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: "connected"
  });
});

// Rota raiz com informações da API
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({
    name: "Sistema de Produção API",
    version: "1.0.0",
    endpoints: {
      materials: "/materials",
      products: "/products",
      simulate: "/simulate",
      health: "/health"
    }
  });
});

// Middleware para rotas não encontradas (404)
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.url} não encontrada`,
    timestamp: new Date().toISOString()
  });
});

// Middleware global de erro
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Função para iniciar o servidor
async function start() {
  try {
    // Conecta ao MongoDB
    await connectDatabase();
    
    // Inicia o servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nRecebido SIGINT. Encerrando servidor...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n Recebido SIGTERM. Encerrando servidor...");
  process.exit(0);
});

// Inicia o servidor
start();