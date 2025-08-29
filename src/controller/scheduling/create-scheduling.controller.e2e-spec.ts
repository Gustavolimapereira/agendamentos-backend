import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import request from 'supertest'

describe('Criar carro (E2E)', () => {
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

  test('[POST] /scheduling 201', async () => {
    const password = '12345236'

    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'teste@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'ADMINISTRADOR',
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

    await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'teste1@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'COLABORADOR',
      },
    })

    const userScheduling = await prisma.user.findUnique({
      where: { email: 'teste1@hotmail.com' },
    })

    const plate = '123-AAAA'
    await prisma.car.create({
      data: {
        plate,
        model: 'Gol G4',
      },
    })

    const carScheduling = await prisma.car.findUnique({
      where: { plate },
    })

    const response = await request(app.getHttpServer())
      .post('/scheduling')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: userScheduling?.id,
        carId: carScheduling?.id,
        startTime: '2025-05-19T10:00:00Z',
        endTime: '2025-05-19T11:00:00Z',
      })

    expect(response.statusCode).toBe(201)
  })

  test('[POST] /scheduling 209', async () => {
    const password = '12345236'

    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'teste2@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'ADMINISTRADOR',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const responseLogin = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'teste2@hotmail.com',
        password: '12345236',
      })

    expect(responseLogin.statusCode).toBe(201)

    await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'teste3@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'COLABORADOR',
      },
    })

    const userScheduling = await prisma.user.findUnique({
      where: { email: 'teste3@hotmail.com' },
    })

    const plate = '123-AAAA'

    const carScheduling = await prisma.car.findUnique({
      where: { plate },
    })

    const response = await request(app.getHttpServer())
      .post('/scheduling')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: userScheduling?.id,
        carId: carScheduling?.id,
        startTime: '2025-05-19T10:00:00Z',
        endTime: '2025-05-19T11:00:00Z',
      })

    expect(response.statusCode).toBe(409)
  })
})
