import { ApiProperty } from '@nestjs/swagger'

export class UsersCreateDto {
  @ApiProperty({ example: 'Gustavo Lima' })
  name!: string

  @ApiProperty({ example: 'gu.lim@hotmail.com' })
  email!: string

  @ApiProperty({ example: '123456' })
  password!: string

  @ApiProperty({ example: 'ADMINISTRADOR' })
  role!: string
}

export class UsersListDto {
  @ApiProperty({ type: [UsersCreateDto] })
  users!: UsersCreateDto[]
}

export class UsersDeleteDto {
  @ApiProperty({ type: [UsersCreateDto] })
  users!: UsersCreateDto[]
}

export class UsersUpdateDto {
  @ApiProperty({ example: 'Gustavo Lima' })
  name!: string

  @ApiProperty({ example: 'gu.lim@hotmail.com' })
  email!: string

  @ApiProperty({ example: '123456' })
  password!: string

  @ApiProperty({ example: 'ADMINISTRADOR' })
  role!: string
}
