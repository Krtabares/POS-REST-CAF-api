import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
  IsDateString,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../schemas/payment.schema';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID de la orden',
    example: '60f7b2c6b4d1c23fbc1a9b10',
  })
  @IsMongoId()
  orderId: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CARD })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ example: 123.45 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ description: 'Fecha de pago (ISO 8601)', required: false })
  @IsOptional()
  @IsDateString()
  paidAt?: string;

  @ApiProperty({
    description: 'ID de la sucursal',
    example: '60f7b2c6b4d1c23fbc1a9b02',
  })
  @IsMongoId()
  branchId: string;
}
