import { app } from "@/app";
import { env } from "./env";

// A porta agora vem do env.ts (validada pelo Zod), não mais hardcoded.
// Em produção, plataformas como Render/Railway injetam a variável PORT automaticamente.
// Em desenvolvimento, o fallback .default(3333) garante que continue funcionando sem configurar nada.
const PORT = env.PORT;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
