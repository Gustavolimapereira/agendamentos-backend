import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CarsListDto } from './dto/cars.dto'

@ApiTags('Cars')
@ApiBearerAuth()
@Controller('/cars')
@UseGuards(JwtAuthGuard)
export class ListAllCarController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiBody({ type: CarsListDto })
  @ApiResponse({ status: 200, description: 'Listagem realizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(200)
  async handle(@CurrentUser() userLoad: UserPayload) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const cars = await this.prisma.car.findMany({
      select: {
        id: true,
        plate: true,
        model: true,
      },
    })

    return { cars }
  }
}
