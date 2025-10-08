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

@Controller('upload-cnh-back')
export class UploadCnhBackController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/cnhBack',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
        },
      }),
    }),
  )
  async uploadCnhBack(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: RequestWithUser, // ou crie um tipo `RequestWithUser`
  ) {
    const userId = request.user.sub // ID extraído do JWT

    const user = await this.usersService.findById(userId)

    if (user?.cnhBackUrl) {
      const oldCnhBackPath = join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'cnhBack',
        user.cnhBackUrl,
      )

      // Verifica se o arquivo existe e remove
      try {
        if (fs.existsSync(oldCnhBackPath)) {
          fs.unlinkSync(oldCnhBackPath)
          console.log(`cnh verso antigo removido: ${user.cnhBackUrl}`)
        }
      } catch (err) {
        console.error('Erro ao remover cnh verso antigo:', err)
      }
    }

    const result = await this.usersService.updateCnhBack(userId, file.filename)
    return { message: 'Avatar atualizado com sucesso', user: result }
  }
}
