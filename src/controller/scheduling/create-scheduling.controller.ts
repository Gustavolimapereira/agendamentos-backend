import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { SchedulingCreateDto } from './dto/scheduling.dto'

const createSchedulingBodySchema = z.object({
  userId: z.string(),
  carId: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
})

const bodyValidationPipe = new ZodValidationPipe(createSchedulingBodySchema)
type CreateSchedulingBodySchema = z.infer<typeof createSchedulingBodySchema>

@ApiTags('Scheduling')
@ApiBearerAuth()
@Controller('/scheduling')
@UseGuards(JwtAuthGuard)
export class CreateSchedulingController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: SchedulingCreateDto })
  @ApiResponse({
    status: 201,
    description: 'Agendamento realizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(201)
  async handle(
    @CurrentUser() userload: UserPayload,
    @Body(bodyValidationPipe) body: CreateSchedulingBodySchema,
  ) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userload.sub },
    })

    if (!userLogin) {
      throw new NotFoundException('Usuário não encontrado')
    }

    const { carId, startTime, endTime } = body

    // Se o usuário for comum, força o userId para ele mesmo
    const userId = userLogin.role === 'COLABORADOR' ? userLogin.id : body.userId

    // Verifica conflito de agendamento
    const schedulingExists = await this.prisma.scheduling.findFirst({
      where: {
        carId,
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    })

    if (schedulingExists) {
      throw new ConflictException(
        'Já existe um agendamento para este carro nesse horário',
      )
    }

    const newScheduling = await this.prisma.scheduling.create({
      data: {
        userId,
        carId,
        startTime,
        endTime,
      },
    })

    return { message: 'Agendamento criado com sucesso', newScheduling }
  }
}
