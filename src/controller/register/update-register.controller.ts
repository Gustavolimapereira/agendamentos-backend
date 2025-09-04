import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'
import { RegisterUpdateDto } from './dto/register.dto'

const updateRegisterBodySchema = z.object({
  date: z.coerce.date().optional(),
  destination: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  signature: z.boolean().optional(),
  description: z.string().optional(),
  userId: z.string().optional(),
  carId: z.string().optional(),
  schedulingId: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateRegisterBodySchema)
type UpdateRegisterBodySchema = z.infer<typeof updateRegisterBodySchema>

@ApiTags('Register')
@ApiBearerAuth()
@Controller('/register/:id')
@UseGuards(JwtAuthGuard)
export class UpdateRegisterController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @ApiParam({
    name: 'id',
    description: 'ID do registro a ser atualizado',
    example: '123',
  })
  @ApiBody({ type: RegisterUpdateDto })
  @ApiResponse({ status: 200, description: 'Atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(200)
  async handle(
    @CurrentUser() userload: UserPayload,
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: UpdateRegisterBodySchema,
  ) {
    const {
      date,
      destination,
      startTime,
      endTime,
      description,
      userId,
      carId,
      schedulingId,
    } = body

    const userLogin = await this.prisma.user.findUnique({
      where: { id: userload.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      const register = await this.prisma.register.findUnique({
        where: { id },
      })

      if (!register || register.userId !== userLogin.id) {
        throw new Error('Você não tem permissão para atualizar este registro')
      }
      const registerUpdate = await this.prisma.register.update({
        where: { id },
        data: {
          date,
          description,
          destination,
          endTime,
          startTime,
          signature: body.signature,
          userId,
          carId,
          schedulingId,
        },
      })

      return { registerUpdate }
    }

    const registerUpdate = await this.prisma.register.update({
      where: { id },
      data: {
        date,
        description,
        destination,
        endTime,
        startTime,
        signature: body.signature,
        userId,
        carId,
        schedulingId,
      },
    })

    return { registerUpdate }
  }
}
