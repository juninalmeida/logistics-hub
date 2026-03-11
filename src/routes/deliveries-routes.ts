import { Router } from "express";

import { DeliveriesController } from "@/controllers/deliveries-controller";

import { ensureAuthenticated } from "@/middlewares/ensune-authenticated";

const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController();

// Instala ( Middleware ) na entrada deste corredor. A partir desta linha, NENHUMA rota abaixo funciona sem o usuário mandar um Token válido no Header.
deliveriesRoutes.use(ensureAuthenticated);
deliveriesRoutes.post("/", deliveriesController.create);

export { deliveriesRoutes };
