import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Api de Agendamento de Carro')
    .setDescription('Documentação da API com Swagger')
    .setVersion('1.0')
    .addBearerAuth() // se usar JWT
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  app.enableCors()

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/avatars',
  })

  console.log('servidor rodando na porta:', port)
  await app.listen(port)
}
bootstrap()
