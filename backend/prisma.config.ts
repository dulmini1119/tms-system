import "dotenv/config";       // 👈 REQUIRED to load .env
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),  // 👈 now Prisma will see it
  },
});
