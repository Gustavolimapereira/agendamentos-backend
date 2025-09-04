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
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Register')
@ApiBearerAuth()
@Controller('/register/:id')
@UseGuards(JwtAuthGuard)
export class DeleteRegisterController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @ApiParam({
    name: 'id',
    description: 'ID do registro a ser deletado',
    example: '123',
  })
  @ApiResponse({ status: 204, description: 'Deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(204)
  async handle(@CurrentUser() userLoad: UserPayload, @Param('id') id: string) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      throw new NotFoundException(
        'Usuario não é um administrador ou supervisor do sistema',
      )
    }

    const register = await this.prisma.register.findUnique({
      where: { id },
    })

    if (!register) {
      throw new NotFoundException('Registro não encontrado')
    }

    await this.prisma.register.delete({
      where: { id },
    })
  }
}
