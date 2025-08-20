import { Module } from '@nestjs/common'
import { envSchema } from './env'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './controller/users/user.module'
import { AuthenticateModule } from './controller/authenticate/authenticate.module'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'
import { UploadModule } from './controller/upload/upload.module'
import { CarModule } from './controller/cars/car.module'
import { SchedulingModule } from './controller/scheduling/scheduling.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    AuthenticateModule,
    UserModule,
    CarModule,
    SchedulingModule,
    UploadModule,
  ],
  controllers: [],
})
export class AppModule {}
