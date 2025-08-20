import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/car/:id')
@UseGuards(JwtAuthGuard)
export class DeleteCarController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() userLoad: UserPayload, @Param('id') id: string) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role !== 'ADMINISTRADOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const car = await this.prisma.car.findUnique({
      where: { id },
    })

    if (!car) {
      throw new NotFoundException('Carro não encontrado')
    }

    await this.prisma.car.delete({
      where: { id },
    })
  }
}
