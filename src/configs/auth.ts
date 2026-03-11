import { env } from "../env"

// Centraliza a configuração do Crachá (Token). Pega o Segredo validado do env e define a validade (1 dia).
export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: "1d",
  },
};
