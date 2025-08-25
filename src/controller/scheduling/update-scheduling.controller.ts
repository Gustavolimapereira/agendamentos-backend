import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'

const updateSchedulingBodySchema = z.object({
  userId: z.string().optional(),
  carId: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateSchedulingBodySchema)
type UpdateSchedulingBodySchema = z.infer<typeof updateSchedulingBodySchema>

@ApiTags('Scheduling')
@ApiBearerAuth()
@Controller('/scheduling/:id')
@UseGuards(JwtAuthGuard)
export class UpdateSchedulingController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiParam({
    name: 'userId',
    description: 'ID do usuário a ser atualizado',
    example: '123',
  })
  @ApiParam({
    name: 'carId',
    description: 'ID do carro a ser atualizado',
    example: '123',
  })
  @ApiParam({
    name: 'startTime',
    description: 'Data e hora de início do agendamento',
    example: '2024-01-01T10:00:00Z',
  })
  @ApiParam({
    name: 'endTime',
    description: 'Data e hora de término do agendamento',
    example: '2024-01-01T12:00:00Z',
  })
  @ApiResponse({ status: 200, description: 'Atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo inválido' })
  @HttpCode(200)
  async handle(
    @CurrentUser() userLoad: UserPayload,
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateSchedulingBodySchema,
  ) {
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

    // 🔒 regra de permissão:
    if (
      userLogin.role === 'COLABORADOR' &&
      scheduling.userId !== userLogin.id
    ) {
      throw new NotFoundException(
        'Colaborador só pode editar os próprios agendamentos',
      )
    }

    const { userId, carId, startTime, endTime } = body

    const updatedScheduling = await this.prisma.scheduling.update({
      where: { id },
      data: {
        userId: userId ?? scheduling.userId,
        carId: carId ?? scheduling.carId,
        startTime: startTime ?? scheduling.startTime,
        endTime: endTime ?? scheduling.endTime,
      },
    })

    return { updatedScheduling }
  }
}
