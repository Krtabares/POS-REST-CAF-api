import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'ID de la categoría',
    example: '60f7b2c6b4d1c23fbc1a9b01',
  })
  @IsMongoId()
  categoryId: string;

  @ApiProperty({ example: 'Café Americano' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Café negro tradicional' })
  @IsString()
  description: string;

  @ApiProperty({ example: 35 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  hasExtras?: boolean;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'ID de la sucursal',
    example: '60f7b2c6b4d1c23fbc1a9b02',
  })
  @IsMongoId()
  branchId: string;
}
