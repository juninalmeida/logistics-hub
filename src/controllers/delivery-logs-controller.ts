import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class DeliveryLogsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    });

    const { delivery_id, description } = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    // [!] Early Return / Fail-Fast: Matamos a requisição no topo com erros se algo não cheirar bem.
    // 1. A caixa solicitada sequer existe no banco?
    if (!delivery) {
      throw new AppError("delivery not found", 404);
    }

    // 2. Business Rule (Regra de Negócio): A empresa proíbe gerar histórico (log) para uma
    // caixa que AINDA está em processamento base. (Exigência de Logística).
    if (delivery.status === "processing") {
      throw new AppError("change status to shipped", 404);
    }

    // Tendo passado pelos 'Seguranças' (Early Returns), o código flui livremente para a inserção.
    await prisma.deliveryLog.create({
      data: {
        // FK: Amarramos este caderninho (Log) à verdadeira caixa (Delivery).
        deliveryId: delivery_id,
        description,
      },
    });

    return response.status(201).json();
  }

  async show(request: Request, response: Response) {
    // 1. Zod Params: Exigimos que a porta seja procurada por um UUID válido.
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsSchema.parse(request.params);

    // 2. Prisma: Buscamos a caixa no galpão.
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    // 3. Segurança In-Controller (Resource Authorization / Ownership):
    // Passar pela catraca do Middleware não é suficiente. Se o usuário for um mero "Cliente", as 
    // letras miúdas da caixa DEVERÃO bater obrigatoriamente com o Crachá (ID) dele.
    // Lógica: Se o cargo for 'customer' E o ID do dono da caixa for DIFERENTE do ID do seu crachá: Rua!
    if (
      request.user?.role === "customer" &&
      request.user.id !== delivery?.userId
    ) {
      throw new AppError("the user can only view ther deliveries", 401);
    }

    return response.json(delivery);
  }
}

export { DeliveryLogsController };
