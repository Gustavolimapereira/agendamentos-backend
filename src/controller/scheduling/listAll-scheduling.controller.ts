import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'

@Controller('/scheduling')
@UseGuards(JwtAuthGuard)
export class ListAllSchedulingController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() userLoad: UserPayload) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    console.log('userLogin', userLogin)

    const schedulings = await this.prisma.scheduling.findMany({
      select: {
        id: true,
        userId: true,
        carId: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return { schedulings }
  }
}
