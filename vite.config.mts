import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node", // Ambiente padrão para evitar Prisma em testes unitários
    environmentMatchGlobs: [["src/http/controllers/**", "prisma"]], // Só usa Prisma para esses testes
    environmentOptions: {
      adapter: "psql",
      envFile: ".env.test",
      prismaEnvVarName: "DATABASE_URL",
    },
  },
});
