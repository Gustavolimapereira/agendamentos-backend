import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Register')
@ApiBearerAuth()
@Controller('/register')
@UseGuards(JwtAuthGuard)
export class ListAllRegisterController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listagem realizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(200)
  async handle(@CurrentUser() userload: UserPayload) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userload.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      const userLoginId = userLogin?.id
      const register = await this.prisma.register.findMany({
        where: { userId: userLoginId },
        select: {
          id: true,
          date: true,
          description: true,
          destination: true,
          endTime: true,
          startTime: true,
          signature: true,
          userId: true,
          carId: true,
          schedulingId: true,
        },
      })

      return { register }
    }

    const register = await this.prisma.register.findMany({
      select: {
        id: true,
        date: true,
        description: true,
        destination: true,
        endTime: true,
        startTime: true,
        signature: true,
        userId: true,
        carId: true,
        schedulingId: true,
      },
    })

    return { register }
  }
}
