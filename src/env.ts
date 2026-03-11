import { z } from "zod";

// Cria um "pedágio" que derruba a aplicação na hora se o dev esquecer de preencher no .env variáveis cruciais como JWT_SECRET ou DATABASE_URL.
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
