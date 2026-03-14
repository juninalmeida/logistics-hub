import { z } from "zod";

// Cria um "pedágio" que derruba a aplicação na hora se o dev esquecer de preencher no .env variáveis cruciais como JWT_SECRET ou DATABASE_URL.
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),

  // z.coerce.number() força a conversão de string (process.env sempre retorna string) para number.
  // .default(3333) define um fallback: se PORT não estiver no .env, usa 3333.
  // Isso torna a porta flexível para deploy (Render, Railway definem PORT automaticamente).
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
