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

const updateCarBodySchema = z.object({
  plate: z.string().optional(),
  model: z.string().optional(),
  active: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateCarBodySchema)
type UpdateCarBodySchema = z.infer<typeof updateCarBodySchema>

@ApiTags('Cars')
@ApiBearerAuth()
@Controller('/car/:id')
@UseGuards(JwtAuthGuard)
export class UpdateCarController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiParam({
    name: 'id',
    description: 'ID do carro a ser atualizado',
    example: '123',
  })
  @ApiResponse({ status: 200, description: 'Atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(200)
  async handle(
    @CurrentUser() userLoad: UserPayload,
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateCarBodySchema,
  ) {
    const { plate, model } = body

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

    const updatedCar = await this.prisma.car.update({
      where: { id },
      data: {
        plate,
        model,
        active: body.active ? body.active === 'true' : undefined,
      },
    })

    return { updatedCar }
  }
}
