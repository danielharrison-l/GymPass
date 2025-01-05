import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

import { z } from "zod";

export async function search(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const searchGymsBodySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });
  const { page, q} = searchGymsBodySchema.parse(request.query);

    const searchGymUseCase = makeSearchGymsUseCase()

    const { gyms } = await searchGymUseCase.execute({
    query: q,
    page
    });
  

  return reply.status(200).send({
    gyms,
  });
}
