import { ApiProperty } from '@nestjs/swagger'

export class CarsCreateDto {
  @ApiProperty({ example: 'OTM 2022' })
  plate!: string

  @ApiProperty({ example: 'Corolla' })
  model!: string
}

export class CarsListDto {
  @ApiProperty({ type: [CarsCreateDto] })
  cars!: CarsCreateDto[]
}

export class CarsDeleteDto {
  @ApiProperty({ type: [CarsCreateDto] })
  users!: CarsCreateDto[]
}

export class CarsUpdateDto {
  @ApiProperty({ example: 'ABC 2025' })
  plate!: string

  @ApiProperty({ example: 'Puntu' })
  model!: string
}
