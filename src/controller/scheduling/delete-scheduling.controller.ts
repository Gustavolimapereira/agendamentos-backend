import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'

@Controller('/scheduling/:id')
@UseGuards(JwtAuthGuard)
export class DeleteSchedulingController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(200)
  async handle(@CurrentUser() userLoad: UserPayload, @Param('id') id: string) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (!userLogin) {
      throw new NotFoundException('Usuário não encontrado')
    }

    const scheduling = await this.prisma.scheduling.findUnique({
      where: { id },
    })

    if (!scheduling) {
      throw new NotFoundException('Agendamento não encontrado')
    }

    if (
      userLogin.role === 'COLABORADOR' &&
      scheduling.userId !== userLogin.id
    ) {
      throw new NotFoundException(
        'Colaborador só pode excluir os próprios agendamentos',
      )
    }

    await this.prisma.scheduling.delete({
      where: { id },
    })

    return { message: 'Agendamento deletado com sucesso' }
  }
}
