import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import * as bcrypt from 'bcrypt'
import request from 'supertest'

describe('Delete car (E2E)', () => {
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

  test('[DELETE] /car/:id 204', async () => {
    const password = '12345236'

    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'teste@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'ADMINISTRADOR', // ou 'administrador', 'diretor', etc.
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

    const plate = '123-AAAA'

    const createCar = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        plate,
        model: 'Gol G4',
      })

    expect(createCar.statusCode).toBe(201)

    const carCreated = await prisma.car.findUnique({
      where: { plate },
    })

    const response = await request(app.getHttpServer())
      .delete(`/car/${carCreated?.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)
  })

  test('[DELETE] /car/:id 404', async () => {
    const password = '12345236'

    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'teste1@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'SUPERVISOR', // ou 'administrador', 'diretor', etc.
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

    const plate = '123-AAAB'

    const createCar = await request(app.getHttpServer())
      .post('/cars')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        plate,
        model: 'Gol G4',
      })

    expect(createCar.statusCode).toBe(201)

    const carCreated = await prisma.car.findUnique({
      where: { plate },
    })

    const response = await request(app.getHttpServer())
      .delete(`/car/${carCreated?.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })

  test('[DELETE] /car/:id 409', async () => {
    const password = '12345236'

    const user = await prisma.user.create({
      data: {
        name: 'Usuário de Teste',
        email: 'teste2@hotmail.com',
        passwordHash: await bcrypt.hash(password, 8),
        role: 'ADMINISTRADOR', // ou 'administrador', 'diretor', etc.
        avatarUrl: null,
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

    const id = 'non-existing-id'

    const response = await request(app.getHttpServer())
      .delete(`/car/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(404)
  })
})
