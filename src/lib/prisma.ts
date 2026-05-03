import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Construímos a conexão em camadas de abstração
const prismaClientSingleton = () => {
  // 1. Criamos um pool de conexões usando o motor nativo do Postgres
  const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
  
  // 2. Acoplamos esse pool ao adaptador oficial do Prisma
  const adapter = new PrismaPg(pool);
  
  // 3. Injetamos o adaptador no PrismaClient
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;