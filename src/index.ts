import { start } from "./server";

start().catch((error) => {
  console.error("Falha ao iniciar a API:", error);
  process.exit(1);
});
