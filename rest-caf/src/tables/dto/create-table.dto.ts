import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsMongoId, Min } from 'class-validator';
import { TableStatus } from '../schemas/table.schema';

export class CreateTableDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  number: number;

  @ApiProperty({ enum: TableStatus, example: TableStatus.FREE })
  @IsEnum(TableStatus)
  status: TableStatus;

  @ApiProperty({
    description: 'ID de la sucursal',
    example: '60f7b2c6b4d1c23fbc1a9b02',
  })
  @IsMongoId()
  branchId: string;
}
