// src/controller/upload/upload-avatar.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path' // ajuste conforme seu guard
import { UsersService } from '../users/users.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import * as fs from 'fs'

@Controller('upload-avatar')
export class UploadAvatarController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
        },
      }),
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser, // ou crie um tipo `RequestWithUser`
  ) {
    const userId = request.user.sub // ID extraído do JWT

    // Busca o usuário no banco para verificar o avatar atual
    const user = await this.usersService.findById(userId)

    if (user?.avatarUrl) {
      const oldAvatarPath = join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'avatars',
        user.avatarUrl,
      )

      // Verifica se o arquivo existe e remove
      try {
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath)
          console.log(`Avatar antigo removido: ${user.avatarUrl}`)
        }
      } catch (err) {
        console.error('Erro ao remover avatar antigo:', err)
      }
    }

    const result = await this.usersService.updateAvatar(userId, file.filename)
    return { message: 'Avatar atualizado com sucesso', user: result }
  }
}
