import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";

const routes = Router();

// Agrupa todas as rotas que começam com "/users" para o usersRoutes
routes.use("/users", usersRoutes);
// Direciona quem quer fazer Login ("entrar") para a guarita de sessões
routes.use("/sessions", sessionsRoutes);

export { routes };
