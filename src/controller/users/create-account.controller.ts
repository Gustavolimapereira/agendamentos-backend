import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import * as bcrypt from 'bcrypt'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'
import { UsersCreateDto } from './dto/users.dto'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(['ADMINISTRADOR', 'SUPERVISOR', 'COLABORADOR']),
})

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@ApiTags('Users')
@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @ApiBody({ type: UsersCreateDto })
  @ApiResponse({ status: 201, description: 'Cadastro realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Algo invalido' })
  @HttpCode(201)
  async handle(
    @CurrentUser() userload: UserPayload,
    @Body(bodyValidationPipe) body: CreateAccountBodySchema,
  ) {
    const userLogin = await this.prisma.user.findUnique({
      where: { id: userload.sub },
    })

    if (userLogin?.role === 'COLABORADOR') {
      throw new NotFoundException(
        'Usuario não é um administrador ou supervisor do sistema',
      )
    }

    const { name, email, password, role } = body

    const userWitchSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    if (userWitchSameEmail) {
      throw new ConflictException('Email já cadastrado')
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
      },
    })

    return { user }
  }
}
