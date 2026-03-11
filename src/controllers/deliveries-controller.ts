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
    // Usamos o status 201 (Created)
    return response.status(201).json();
  }

  async index(request: Request, response: Response) {
    const deliveries = await prisma.delivery.findMany({
      // O include instrui o Prisma a fazer um JOIN no banco de dados.
      // Em vez de só trazer dados da Caixa, ele traz os dados do Cliente (User) dono dela também, em 1 única ida ao banco
      include: {
        // Usamos o 'select' para esculpir o que queremos do User.
        // NUNCA retorne o User inteiro num include, pois a senha vazaria junto!
        user: { select: { name: true, email: true } },
      },
    });

    return response.json(deliveries);
  }
}

export { DeliveriesController };
