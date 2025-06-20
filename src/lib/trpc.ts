import { AppRouter } from '@/server/routers/_app';
import { createTRPCReact } from '@trpc/react-query';

// Export para compatibilidade com código existente
export const trpc = createTRPCReact<AppRouter>(); 