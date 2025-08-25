import { ApiProperty } from '@nestjs/swagger'

export class UsersCreateDto {
  @ApiProperty({ example: 'Nome do usuario' })
  name!: string

  @ApiProperty({ example: 'emailexemplo@email.com' })
  email!: string

  @ApiProperty({ example: '123456' })
  password!: string

  @ApiProperty({ example: 'ADMINISTRADOR, SUPERVISOR, COLABORADOR' })
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
  @ApiProperty({ example: 'usuario atualizado' })
  name!: string

  @ApiProperty({ example: 'emailexemplo1@email.com' })
  email!: string

  @ApiProperty({ example: '123456' })
  password!: string

  @ApiProperty({ example: 'COLABORADOR' })
  role!: string
}
