import { Router } from "express";

import { UsersController } from "@/controllers/user-controller";

const usersRoutes = Router();
const usersController = new UsersController();

// Redireciona a requisição POST para o método create do Controller
usersRoutes.post("/", usersController.create);

export { usersRoutes };
