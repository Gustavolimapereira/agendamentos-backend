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
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { CarsCreateDto } from './dto/cars.dto'

const createCarBodySchema = z.object({
  plate: z.string(),
  model: z.string(),
  active: z.boolean().optional(),
  description: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createCarBodySchema)
type CreateCarBodySchema = z.infer<typeof createCarBodySchema>

@ApiTags('Cars')
@ApiBearerAuth()
@Controller('/cars')
@UseGuards(JwtAuthGuard)
export class CreateCarController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: CarsCreateDto })
  @ApiResponse({ status: 201, description: 'Cadastro realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(201)
  async handle(
    @CurrentUser() userload: UserPayload,
    @Body(bodyValidationPipe) body: CreateCarBodySchema,
  ) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userload.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      throw new NotFoundException('Usuario não é um administrador do sistema')
    }

    const { plate, model } = body

    const carrWitchSamePlate = await this.prisma.car.findUnique({
      where: { plate },
    })

    if (carrWitchSamePlate) {
      throw new ConflictException('Carro já cadastrado')
    }

    const car = await this.prisma.car.create({
      data: {
        plate,
        model,
      },
    })

    return { car }
  }
}
