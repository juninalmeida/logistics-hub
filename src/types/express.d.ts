// Informa ao TypeScript que, a partir de agora, toda Request do Express carrega um usuário embutido.
declare namespace Express {
  export interface Request {
    user?: {
      id: String;
      role: String;
    };
  }
}
