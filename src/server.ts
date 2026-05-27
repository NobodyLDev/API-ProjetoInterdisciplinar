import express from "express";
import path from "path";
import materialsRoutes from "./routes/materialRoutes";
import productsRoutes from "./routes/productRoutes";
import simulationRoutes from "./routes/simulationRoutes";
import { connectDatabase } from "./database/database";

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
// Servir front-end estático (pasta src/Frontend durante desenvolvimento)
const frontendPath = path.resolve(process.cwd(), "src", "Frontend");
app.use(express.static(frontendPath));

app.use("/materials", materialsRoutes);
app.use("/products", productsRoutes);
app.use("/simulate", simulationRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
// Rota catch-all para SPA: devolve index.html para rotas não-API
app.get("/*", (req, res) => {
  const indexFile = path.join(frontendPath, "index.html");
  res.sendFile(indexFile);
});

export async function start() {
  await connectDatabase();

  app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
  });
}
