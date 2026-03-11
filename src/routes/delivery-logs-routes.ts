import { Router } from "express";

import { DeliveryLogsController } from "@/controllers/delivery-logs-controller";

import { ensureAuthenticated } from "@/middlewares/ensune-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const deliveryLogsRoutes = Router();
const deliveryLogsController = new DeliveryLogsController();

// Técnica de "Inline Middlewares". Em vez de usar um .use() que afeta TODAS as rotas abaixo dele,
// nós injetamos os fiscais especificamente apenas na rota POST.
deliveryLogsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["sale"]),
  deliveryLogsController.create,
);

// Diferente do POST (que só Funcionário pode criar), o GET de visualizar logs permite 
// que o Cliente final com crachá "customer" entre pra rastrear a compra dele.
deliveryLogsRoutes.get(
  "/:delivery_id/show",
  ensureAuthenticated,
  verifyUserAuthorization(["sale", "customer"]),
  deliveryLogsController.show,
);

export { deliveryLogsRoutes };
