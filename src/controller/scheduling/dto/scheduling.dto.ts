import { ApiProperty } from '@nestjs/swagger'

export class SchedulingCreateDto {
  @ApiProperty({ example: 'id usuario' })
  userId!: string

  @ApiProperty({ example: 'id do carro' })
  carId!: string

  @ApiProperty({ example: '2025-05-19T10:00:00Z' })
  startTime!: string

  @ApiProperty({ example: '2025-05-19T11:00:00Z' })
  endTime!: string
}

export class SchedulingListDto {
  @ApiProperty({ type: [SchedulingCreateDto] })
  schedulings!: [SchedulingCreateDto]
}

export class SchedulingUpdateDto {
  @ApiProperty({ example: 'id usuario' })
  userId!: string

  @ApiProperty({ example: 'id do carro' })
  carId!: string

  @ApiProperty({ example: '2025-05-19T10:00:00Z' })
  startTime!: string

  @ApiProperty({ example: '2025-05-19T11:00:00Z' })
  endTime!: string
}
