import { Router } from "express";

import { DeliveriesController } from "@/controllers/deliveries-controller";

import { ensureAuthenticated } from "@/middlewares/ensune-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController();

// Instala ( Middlewares ) na entrada deste corredor.
// 1º: NENHUMA rota abaixo funciona sem o usuário mandar um Token válido no Header (Autenticação).
// 2º: Passou? Então verifica se o cargo/role do cara permite ele ficar nesse corredor (Autorização).
deliveriesRoutes.use(ensureAuthenticated, verifyUserAuthorization(["sale"]));
deliveriesRoutes.post("/", deliveriesController.create);
deliveriesRoutes.get("/", deliveriesController.index);

export { deliveriesRoutes };
