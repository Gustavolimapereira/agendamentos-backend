import { Module } from '@nestjs/common'
import { UploadAvatarController } from './upload-avatar.controller'
import { UserModule } from '../users/user.module'
import { UploadCnhFrontController } from './upload-cnhFront.controller'
import { UploadCnhBackController } from './upload-cnhBack.controller'

@Module({
  controllers: [
    UploadAvatarController,
    UploadCnhFrontController,
    UploadCnhBackController,
  ],
  imports: [UserModule],
  providers: [],
})
export class UploadModule {}
