import { Router } from "express";

import { usersRoutes } from "./users-routes";

const routes = Router();

// Agrupa todas as rotas que começam com "/users" para o usersRoutes
routes.use("/users", usersRoutes);

export { routes };
