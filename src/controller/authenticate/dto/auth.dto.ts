import { ApiProperty } from '@nestjs/swagger'

export class AuthDto {
  @ApiProperty({ example: 'gu.lim@hotmail.com' })
  email!: string

  @ApiProperty({ example: '123456' })
  password!: string
}
