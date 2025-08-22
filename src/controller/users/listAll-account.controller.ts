import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class ListAllAccountController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiResponse({
    status: 201,
    description: 'Lista de usuarios exibida com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(200)
  async handle(@CurrentUser() userLoad: UserPayload) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userLoad.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        cnhFrontUrl: true,
        cnhBackUrl: true,
      },
    })

    return { users }
  }
}
