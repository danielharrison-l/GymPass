import { registerController } from "@/http/controllers/users/register.controller";
import { FastifyInstance } from "fastify";
import { authenticateController } from "./authenticate.controller";
import { profileController } from "./profile";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { refresh } from "./refresh";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", registerController);
  app.post("/sessions", authenticateController);

  app.patch("/token/refresh", refresh);
  
  // Authenticated
  app.get("/me", {onRequest: [verifyJwt]},profileController)
}
