import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import materialsRoutes from "./routes/materialRoutes";
import productsRoutes from "./routes/productRoutes";
import simulationRoutes from "./routes/simulationRoutes";
import historyRoutes from "./routes/historyRoutes";
import { connectDatabase } from "./database/database";
import { config } from "./config/config";

import {
  loggerMiddleware,
  notFoundMiddleware,
  errorMiddleware,
} from "./middlewares";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(loggerMiddleware);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const frontendPath = path.resolve(process.cwd(), "src", "Frontend");
app.use(express.static(frontendPath));

app.use("/materials", materialsRoutes);
app.use("/products", productsRoutes);
app.use("/simulate", simulationRoutes);
app.use("/history", historyRoutes);

app.use((req, res, next) => {
  if (req.method !== "GET") return next();

  if (
    req.path.startsWith("/materials") ||
    req.path.startsWith("/products") ||
    req.path.startsWith("/simulate") ||
    req.path.startsWith("/history")
  ) {
    return next();
  }

  const indexFile = path.join(frontendPath, "index.html");
  res.sendFile(indexFile);
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;

export async function start() {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`API rodando em http://localhost:${config.port}`);
  });
}