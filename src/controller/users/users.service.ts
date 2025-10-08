// src/users/users.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service' // ajuste o caminho se necessário

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateAvatar(userId: string, filename: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: filename },
    })
  }

  async updateCnhFront(userId: string, filename: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { cnhFrontUrl: filename },
    })
  }

  async updateCnhBack(userId: string, filename: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { cnhBackUrl: filename },
    })
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    })
  }
}
