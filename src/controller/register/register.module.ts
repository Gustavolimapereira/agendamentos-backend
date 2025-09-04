import { PrismaService } from '@/prisma/prisma.service'
import { CreateRegisterController } from './create-register.controller'
import { Module } from '@nestjs/common'
import { DeleteRegisterController } from './delete-register.controller'
import { ListAllRegisterController } from './listAll-register.controller'
import { UpdateRegisterController } from './update-register.controller'

@Module({
  controllers: [
    CreateRegisterController,
    DeleteRegisterController,
    ListAllRegisterController,
    UpdateRegisterController,
  ],
  providers: [PrismaService],
  exports: [],
})
export class RegisterModule {}
