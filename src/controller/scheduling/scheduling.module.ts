import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateSchedulingController } from './create-scheduling.controller'
import { ListAllSchedulingController } from './listAll-scheduling.controller'
import { UpdateSchedulingController } from './update-scheduling.controller'
import { DeleteSchedulingController } from './delete-scheduling.controller'

@Module({
  controllers: [
    CreateSchedulingController,
    ListAllSchedulingController,
    UpdateSchedulingController,
    DeleteSchedulingController,
  ],
  providers: [PrismaService],
  exports: [],
})
export class SchedulingModule {}
