import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import request from 'supertest'

describe('Atualizao usuario (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[UPDATE ADMINISTRADOR] /accounts/:id', async () => {
    const password = '12345236'

    // cria admin
    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste admin',
        email: 'teste@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'ADMINISTRADOR',
        avatarUrl: null,
      },
    })

    // cria colaborador
    const userColab = await prisma.user.create({
      data: {
        name: 'Usuário de Teste colaborador',
        email: 'teste.colab@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'COLABORADOR',
        avatarUrl: null,
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const responseLogin = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'teste@hotmail.com',
        password: '12345236',
      })

    expect(responseLogin.statusCode).toBe(201)

    // chama update
    const response = await request(app.getHttpServer())
      .put(`/accounts/${userColab.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Usuário Atualizado',
        role: 'SUPERVISOR',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.userUpdated.name).toBe('Usuário Atualizado')
    expect(response.body.userUpdated.role).toBe('SUPERVISOR')

    // garante no banco também
    const updatedUser = await prisma.user.findUnique({
      where: { id: userColab.id },
    })
    expect(updatedUser?.name).toBe('Usuário Atualizado')
    expect(updatedUser?.role).toBe('SUPERVISOR')
  })

  test('[UPDATE COLABORADOR] /accounts/:id', async () => {
    const password = '12345236'

    // cria admin
    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste colaborador',
        email: 'teste1@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'COLABORADOR',
        avatarUrl: null,
      },
    })

    // cria colaborador
    const userColab = await prisma.user.create({
      data: {
        name: 'Usuário de Teste colaborador',
        email: 'teste.colab1@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'COLABORADOR',
        avatarUrl: null,
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const responseLogin = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'teste1@hotmail.com',
        password: '12345236',
      })

    expect(responseLogin.statusCode).toBe(201)

    // chama update
    const response = await request(app.getHttpServer())
      .put(`/accounts/${userColab.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Usuário Atualizado',
        role: 'SUPERVISOR',
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBe(
      'Usuario não é um administrador ou supervisor do sistema',
    )
  })
})
