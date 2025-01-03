import {  InMemoryGymsRepository} from '@/repositories/in memory/in-memory-gyms-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

describe('#FetchNearbyGymsUseCase unit test', (): void => {
  describe('when fetching nearby gyms', (): void => {
    let gymsRepository: InMemoryGymsRepository
    // sut = system under test
    let sut: FetchNearbyGymsUseCase

    beforeEach(async (): Promise<void> => {
      gymsRepository = new InMemoryGymsRepository()
      sut = new FetchNearbyGymsUseCase(gymsRepository)
    })

    afterEach((): void => {
      vi.clearAllMocks()
    })

    it('should be able to fetch nearby gyms', async (): Promise<void> => {
      await gymsRepository.create({
        title: 'Near Gym',
        description: null,
        phone: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

      await gymsRepository.create({
        title: 'Far Gym',
        description: null,
        phone: null,
        latitude: -27.0610928,
        longitude: -49.5229501,
      })

      const { gyms } = await sut.execute({
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })

      expect(gyms).toHaveLength(1)
      expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
    })
  })
})