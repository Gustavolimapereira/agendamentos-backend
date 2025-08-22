import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/accounts/:id')
@UseGuards(JwtAuthGuard)
export class DeleteAccountController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @ApiParam({
    name: 'id',
    description: 'ID do usuário a ser deletado',
    example: '123',
  })
  @ApiResponse({ status: 204, description: 'Cadastro deletado com sucesso' })
  @ApiResponse({
    status: 401,
    description: 'Algo inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @HttpCode(204)
  async handle(@CurrentUser() userLoad: UserPayload, @Param('id') id: string) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('Usuario não encontrado')
    }

    await this.prisma.user.delete({
      where: { id },
    })
  }
}
