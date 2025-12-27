import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductExtraDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '60f7b2c6b4d1c23fbc1a9b03',
  })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 'Extra shot' })
  @IsString()
  name: string;

  @ApiProperty({ example: 8 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
