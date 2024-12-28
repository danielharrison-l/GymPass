import { CheckIn, User } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distances-between-coordinates";

interface CheckinUseCaseRequest {
  userId: string;
  gymId: string;
  userLatidude: number;
  userLongitude: number;
}

interface CheckinUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckinUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatidude,
    userLongitude,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatidude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );

    const MAX_DISTANCE_IN_KM = 0.1;

    if (distance > MAX_DISTANCE_IN_KM) {
      throw new Error();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    console.log("checkInOnSameDay", checkInOnSameDay);

    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      user_Id: userId,
      gym_Id: gymId,
    });

    return {
      checkIn,
    };
  }
}
