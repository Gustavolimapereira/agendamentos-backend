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
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { RegisterCreateDto } from './dto/register.dto'

const createRegisterBodySchema = z.object({
  date: z.coerce.date(),
  destination: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  signature: z.string().optional(),
  description: z.string().optional(),
  userId: z.string(),
  carId: z.string(),
  schedulingId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createRegisterBodySchema)
type CreateRegisterBodySchema = z.infer<typeof createRegisterBodySchema>

@ApiTags('Register')
@Controller('/register')
@UseGuards(JwtAuthGuard)
export class CreateRegisterController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: RegisterCreateDto })
  @ApiResponse({ status: 201, description: 'Registro realizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Algo invalido' })
  @HttpCode(201)
  async handle(
    @CurrentUser() userload: UserPayload,
    @Body(bodyValidationPipe) body: CreateRegisterBodySchema,
  ) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userload.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      throw new NotFoundException(
        'Usuario não é um administrador ou supervisor do sistema',
      )
    }

    const {
      date,
      destination,
      startTime,
      endTime,
      userId,
      carId,
      schedulingId,
    } = body

    const register = await this.prisma.register.create({
      data: {
        date,
        destination,
        startTime,
        endTime,
        userId,
        carId,
        schedulingId,
      },
    })

    return { register }
  }
}
