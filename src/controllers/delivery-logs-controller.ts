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

    // [!] Early Return / Fail-Fast: Portão de segurança triplo — se qualquer fase furar, joga erro na hora.
    // 1. A caixa sequer existe no banco?
    if (!delivery) {
      throw new AppError("delivery not found", 404);
    }

    // 2. Business Rule: Caixas já finalizadas ("delivered") são imutáveis. Nada mais pode ser registrado.
    if (delivery.status === "delivered") {
      throw new AppError("this order has already been delivered");
    }

    // 3. Business Rule: Caixas cruas ("processing") ainda não saíram para entrega, log é inválido.
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

    // 2. Prisma Join: Buscamos a caixa já com o dono (user) e o histórico (logs) na mesma query.
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: {
        user: true,
        logs: true,
      },
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
