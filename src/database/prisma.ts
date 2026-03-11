import { PrismaClient } from "@prisma/client";

// Instancia a conexão com o banco. O "log: query" faz o Prisma printar no terminal o SQL real que ele gerou no ambiente de desenvolvimento.
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "production" ? [] : ["query"],
});
