import { PrismaService } from '@/prisma/prisma.service'
import { CreateRegisterController } from './create-register.controller'
import { Module } from '@nestjs/common'

@Module({
  controllers: [CreateRegisterController],
  providers: [PrismaService],
  exports: [],
})
export class RegisterModule {}
