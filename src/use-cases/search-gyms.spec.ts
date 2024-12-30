import { InMemoryGymsRepository } from "@/repositories/in memory/in-memory-gyms-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymsUseCase } from "./search-gyms";

let gymsRepostory: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepostory = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepostory);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepostory.create({
      title: "JavaScript Gym",
      description: null,
      phone: null,
      latitude: -1.9449863,
      longitude: -48.8381827,
    });

    await gymsRepostory.create({
      title: "TypeScript Gym",
      description: null,
      phone: null,
      latitude: -1.9449863,
      longitude: -48.8381827,
    });

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym" }),
    ]);
  });

  it("should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepostory.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -1.9449863,
        longitude: -48.8381827,
      });
    }

    const { gyms } = await sut.execute({
      query: "JavaScript",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JavaScript Gym 21" }),
      expect.objectContaining({ title: "JavaScript Gym 22" }),
    ]);
  });
});
