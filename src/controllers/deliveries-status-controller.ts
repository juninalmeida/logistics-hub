import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class DeliveriesStatusController {
  async update(request: Request, response: Response) {
    // request.params e request.body lidam com partes diferentes da requisição.
    // O ID vem via URL (Route Parameter) para identificar "Qual" caixa vamos alterar.
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    // O status vem encapsulado no corpo (Body) dizendo "O que" vamos alterar nela.
    const bodySchema = z.object({
      // z.enum() é a nossa segurança máxima. Ele proíbe qualquer status inventado ("perdido", "extraviado").
      // Se não for "processing", "shipped" ou "delivered", o Zod barra a requisição na hora.
      status: z.enum(["processing", "shipped", "delivered"]),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    // Prisma update precisa saber obrigatoriamente duas coisas:
    await prisma.delivery.update({
      // 1. O que vamos mudar na caixa achada (o novo status)
      data: {
        status,
      },
      // 2. Quem é a caixa alvo (pelo ID que extraímos da URL/Params)
      where: {
        id,
      },
    });

    return response.json();
  }
}

export { DeliveriesStatusController };
