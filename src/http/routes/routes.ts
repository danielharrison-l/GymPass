import { registerController } from "@/http/controllers/register.controller";
import { FastifyInstance } from "fastify";
import { authenticateController } from "../controllers/authenticate.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/sessions", authenticateController);
}
