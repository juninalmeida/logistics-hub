import express from "express";
import "express-async-errors"; // Importado antes das rotas para o Express interceptar erros em handlers assíncronos.

import { errorHandler } from "./middlewares/error-handling";

const app = express();

app.use(express.json());

// O middleware de tratamento de erros tem que ser o último a ser registrado
app.use(errorHandler);

export { app };
