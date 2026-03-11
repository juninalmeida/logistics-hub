import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { hash } from "bcrypt";

class UsersController {
  // O Controller isola a regra de negócio/lógica de processamento da Rota
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    });

    // Zod faz o Raio-X do pacote. Se faltarem dados (ex: senha < 6), ele lança o ZodError pego no middleware.
    const { name, email, password } = bodySchema.parse(request.body);

    // Pergunta pro (Prisma) se essa pessoa já existe na prateleira.
    const userWithSameEmail = await prisma.user.findFirst({ where: { email } });

    if (userWithSameEmail) {
      throw new AppError("Usuário já cadastrado com este e-mail.", 400);
    }

    // Transforma a senha em texto puro num código embaralhado irrastreável (Hash) antes de ir pro banco
    const passwordHash = await hash(password, 8);

    // Manda o Prisma guardar a caixa na prateleira de verdade.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    // Destructuring: Arranca a senha do objeto pra não vazar na resposta do pacote (boa prática de segurança).
    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }
}

export { UsersController };
