import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

// O SessionsController aqui que o usuário tenta fazer Login para ganhar um(Token)
class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    // Busca o funcionário/cliente no banco de dados.
    const user = await prisma.user.findFirst({
      where: { email },
    });

    // Se não achar o email, gera um erro genérico
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // O bcrypt compara a senha digitada agora com a hash irreversível salva no banco.
    const passwordMatched = await compare(password, user.password);

    // Se errar a senha, dá EXATAMENTE o mesmo erro genérico.
    if (!passwordMatched) {
      throw new AppError("Invalid email or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    // Deu tudo certo! Gera o "Crachá" (Token JWT) carimbando o ID do usuário (subject) e a validade.
    const token = sign({ role: user.role ?? "customer" }, secret, {
      subject: user.id,
      expiresIn,
    });

    // Novamente, arranca a senha (via destructuring) antes de devolver os dados pro cliente.
    const { password: passwordHash, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
