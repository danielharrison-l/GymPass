import { PrismaUsersRepository } from "@/repositories/prisma/prisma.users.repository";
import { AuthenticateUseCase } from "@/use-cases/authenticate";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

import { z } from "zod";

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const { email, password } = registerBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const {user} = await authenticateUseCase.execute({
      email,
      password,
    });


    const token = await reply.jwtSign(
      {
        role: user.role
      }, 
      {
      sign: {
        sub: user.id,
      }
    })

    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      }, 
      {
      sign: {
        sub: user.id,
        expiresIn: '7d'
      }
    })


    return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // HTTPS
      sameSite: true,
      httpOnly: true
    })
    .status(200)
    .send({
      token
    });

  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }
}
