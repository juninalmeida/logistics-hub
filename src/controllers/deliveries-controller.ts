import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class DeliveriesController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      // Exigimos que o ID do usuário (cliente que mandou a caixa) seja obrigatoriamente um formato UUID válido.
      user_id: z.string().uuid(),
      description: z.string(),
    });

    const { user_id, description } = bodySchema.parse(request.body);

    await prisma.delivery.create({
      data: {
        // userId é a "Etiqueta in-removível" (Foreign Key). 
        // Estamos colando a caixa (delivery) na prateleira do usuário (user_id) pra sempre.
        userId: user_id,
        description,
      },
    });

    // O DeliveriesController. Graças ao "Middleware" instalado na rota, este controller tem certeza absoluta que quem chegou aqui está autenticado.
    // Usamos o status 201 (Created) porque uma nova entidade/caixa acabou de nascer no galpão, é mais semântico que o 200 (OK genérico).
    return response.status(201).json();
  }
}

export { DeliveriesController };
