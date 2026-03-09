import express from "express";
import "express-async-errors"; // Importado antes das rotas para o Express interceptar erros em handlers assíncronos.

import { routes } from "./routes";
import { errorHandler } from "./middlewares/error-handling";

const app = express();

app.use(express.json());
app.use(routes);

// O middleware de tratamento de erros tem que ser o último a ser registrado
app.use(errorHandler);

export { app };
