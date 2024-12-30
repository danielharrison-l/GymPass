import { expect, describe, it, beforeEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in memory/in-memory-check-ins-repository";
import { afterEach } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_Id: "gym-01",
      user_Id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("shold not be able to validate an inexistent check-in ", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of creation", async () => {
    vi.setSystemTime(new Date(2022, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_Id: "gym-01",
      user_Id: "user-01",
    });

    const twentyMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
