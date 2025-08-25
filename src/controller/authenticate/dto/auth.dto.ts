import { ApiProperty } from '@nestjs/swagger'

export class AuthDto {
  @ApiProperty({ example: 'exemploemail@email.com' })
  email!: string

  @ApiProperty({ example: '123456' })
  password!: string
}
