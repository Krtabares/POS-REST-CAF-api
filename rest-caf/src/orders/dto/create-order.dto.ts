import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMinSize,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderStatus, OrderType, PaymentStatus } from '../schemas/order.schema';

export class CreateOrderItemExtraDto {
  @ApiProperty({
    description: 'ID del extra',
    example: '60f7b2c6b4d1c23fbc1a9b03',
  })
  @IsMongoId()
  extraId: string;

  @ApiProperty({ example: 'Extra shot' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 8 })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderItemVariantDto {
  @ApiProperty({
    description: 'ID del tamaño',
    example: '60f7b2c6b4d1c23fbc1a9b04',
  })
  @IsMongoId()
  variantId: string;

  @ApiProperty({ example: 'Mediano' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  priceModifier: number;
}

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID del producto',
    example: '60f7b2c6b4d1c23fbc1a9b02',
  })
  @IsMongoId()
  productId: string;

  @ApiProperty({ example: 'Café Americano' })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, type: () => CreateOrderItemVariantDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOrderItemVariantDto)
  variant?: CreateOrderItemVariantDto;

  @ApiProperty({ type: () => [CreateOrderItemExtraDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemExtraDto)
  extras?: CreateOrderItemExtraDto[];

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 35 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 70 })
  @IsNumber()
  @Min(0)
  total: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1001 })
  @IsInt()
  @Min(1)
  orderNumber: number;

  @ApiProperty({ enum: OrderType, example: OrderType.DINE_IN })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({
    description: 'ID de la mesa (opcional en TAKE_AWAY)',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  tableId?: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREATED })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus, example: PaymentStatus.PENDING })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty({ type: () => [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ example: 16 })
  @IsNumber()
  @Min(0)
  tax: number;

  @ApiProperty({ example: 116 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({
    description: 'ID del usuario creador',
    example: '60f7b2c6b4d1c23fbc1a9b01',
  })
  @IsMongoId()
  createdBy: string;

  @ApiProperty({
    description: 'ID de la sucursal',
    example: '60f7b2c6b4d1c23fbc1a9b02',
  })
  @IsMongoId()
  branchId: string;
}
