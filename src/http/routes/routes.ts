import { registerController } from "@/http/controllers/register.controller";
import { FastifyInstance } from "fastify";
import { authenticateController } from "../controllers/authenticate.controller";
import { profileController } from "../controllers/profile";
import { verifyJwt } from "../middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", registerController);

  
  app.post("/sessions", authenticateController);
  
  app.get("/me", {onRequest: [verifyJwt]},profileController)
}
