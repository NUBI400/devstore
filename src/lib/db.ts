import { PrismaClient } from "@prisma/client";

declare global {
  var cachedPrisma: PrismaClient | any;
}

export let db: PrismaClient | any;

// Criar um mock do DB para desenvolvimento
const mockDb = {
  user: {
    findUnique: async () => ({ id: 'mock-id', name: 'Usuário Mock', email: 'mock@example.com', role: 'USER' }),
    findFirst: async () => ({ id: 'mock-id', name: 'Usuário Mock', email: 'mock@example.com', role: 'USER' }),
    create: async (data: any) => ({ id: 'mock-id', ...data.data }),
    update: async (data: any) => ({ id: 'mock-id', ...data.data }),
  },
  customer: {
    findUnique: async () => null,
    upsert: async (data: any) => ({ id: 'mock-customer', userId: data.where.userId, subscriptionStatus: 'ACTIVE' }),
    updateMany: async () => ({ count: 1 }),
  },
  account: {
    create: async (data: any) => ({ id: 'mock-account', ...data.data }),
  },
  session: {
    create: async (data: any) => ({ id: 'mock-session', ...data.data }),
  },
};

try {
  if (process.env.NODE_ENV === "production") {
    db = new PrismaClient();
  } else {
    if (!global.cachedPrisma) {
      // Em desenvolvimento, tentar inicializar o Prisma, mas usar mockDb se falhar
      try {
        global.cachedPrisma = new PrismaClient();
      } catch (error) {
        console.warn("Usando DB mock para desenvolvimento");
        global.cachedPrisma = mockDb;
      }
    }
    db = global.cachedPrisma;
  }
} catch (error) {
  console.warn("Erro ao inicializar Prisma, usando mock para desenvolvimento");
  db = mockDb;
} 