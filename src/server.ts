import dotenv from "dotenv";
import express from "express";
import env from "env-var";
import router from "./routes";
import databaseHelper from "@/loaders/database";
import logger from "@/loaders/logger";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@/config/swagger";

const app = express();
dotenv.config();

const port = env.get("PORT").required().asPortNumber();
const NODE_ENV = env.get("NODE_ENV").default("development").asString();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Iniciar conexões com o banco de dados
databaseHelper.initConnections();

// Documentação da API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", router);
app.listen(port, () => {
  logger.info(`Servidor rodando na porta ${port} - Ambiente: ${NODE_ENV} 🚀`);
});
