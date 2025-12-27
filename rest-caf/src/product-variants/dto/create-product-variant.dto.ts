import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { VariantName } from '../schemas/product-variant.schema';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '60f7b2c6b4d1c23fbc1a9b03',
  })
  @IsMongoId()
  productId: string;

  @ApiProperty({ enum: VariantName, example: VariantName.MEDIANO })
  @IsEnum(VariantName)
  name: VariantName;

  @ApiProperty({ example: 10 })
  @IsNumber()
  priceModifier: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
