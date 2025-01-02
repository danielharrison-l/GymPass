import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/services/prisma";
import dayjs from "dayjs";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      }
    })

    return checkIn
  }
  async create(data: Prisma.CheckInUncheckedCreateInput){
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }
  async findByUserIdOnDate(userId: string, date: Date){
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = await prisma.checkIn.findFirst({
      where: {
        user_Id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        }
      }
    })
    return checkInOnSameDate
  }
      
  
  async countByUserId(userId: string){
    const count = await prisma.checkIn.count({
      where: {
        user_Id: userId
      }
    })

    return count
  }
  async findManyByUserId(userId: string, page: number){
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_Id: userId
      },
      take: 20,
      skip: (page - 1) * 20
    })
    return checkIns
  }
  async save(data: CheckIn){
    const checkInUpdated = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data: data
    })
    return checkInUpdated
  }
}