import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { PrismaService } from '@/prisma/prisma.service'
import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Cars')
@ApiBearerAuth()
@Controller('/cars')
@UseGuards(JwtAuthGuard)
export class ListAllCarController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Listagem realizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(200)
  async handle() {
    /*
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })


    if (userLogin?.role === 'COLABORADOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    } */

    const cars = await this.prisma.car.findMany({
      select: {
        id: true,
        plate: true,
        model: true,
        active: true,
      },
    })

    return { cars }
  }
}
