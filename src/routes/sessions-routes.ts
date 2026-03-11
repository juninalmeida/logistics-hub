import { Router } from "express";
import { SessionsController } from "@/controllers/sessions-controller";

const sessionsRoutes = Router();

const sessionsController = new SessionsController();

// Rota de Login: Ao bater no POST /sessions, enviamos o cara para tentar criar uma sessão (entrar)
sessionsRoutes.post("/", sessionsController.create);

export { sessionsRoutes };
