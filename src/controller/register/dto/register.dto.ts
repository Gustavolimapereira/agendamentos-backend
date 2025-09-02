import { ApiProperty } from '@nestjs/swagger'

export class RegisterCreateDto {
  @ApiProperty({ example: '2025-09-02T00:00:00.000Z' })
  date!: string

  @ApiProperty({ example: 'nome_da_cidade' })
  destination!: string

  @ApiProperty({ example: '2025-09-02T10:00:00.000Z' })
  startTime!: string

  @ApiProperty({ example: '2025-09-02T11:00:00.000Z' })
  endTime!: string

  @ApiProperty({ example: 'id do usuario que vai utilizar o carro' })
  userId!: string

  @ApiProperty({ example: 'id do carro que vai ser utilizado' })
  carId!: string

  @ApiProperty({ example: 'id do agendamento que já existe' })
  schedulingId!: string
}
