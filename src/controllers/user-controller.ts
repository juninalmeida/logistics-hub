import { Request, Response } from "express";
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

    // Transforma a senha em texto puro num código embaralhado irrastreável (Hash) antes de ir pro banco
    const passwordHash = await hash(password, 8);

    return response.json({ message: "ok!", passwordHash });
  }
}

export { UsersController };
