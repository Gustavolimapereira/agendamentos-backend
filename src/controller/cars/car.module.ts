import { Module } from '@nestjs/common'
import { CreateCarController } from './create-car.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { ListAllCarController } from './listAll-car.controller'
import { UpdateCarController } from './update-car.controller'
import { DeleteCarController } from './delete-car.controller'

@Module({
  controllers: [
    CreateCarController,
    ListAllCarController,
    UpdateCarController,
    DeleteCarController,
  ],
  providers: [PrismaService],
  exports: [],
})
export class CarModule {}
