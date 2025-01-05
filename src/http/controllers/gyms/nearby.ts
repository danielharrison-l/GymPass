import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

import { z } from "zod";

export async function nearby(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const nearbyGymsBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  });
  const { latitude, longitude} = nearbyGymsBodySchema.parse(request.body);

    const fetchNearbyGymUseCase = makeFetchNearbyGymsUseCase()

    const { gyms } = await fetchNearbyGymUseCase.execute({
      userLatitude: latitude,
      userLongitude: longitude
    });
  

  return reply.status(201).send({
    gyms,
  });
}
