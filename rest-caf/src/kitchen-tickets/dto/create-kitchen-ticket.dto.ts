import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { KitchenTicketStatus } from '../schemas/kitchen-ticket.schema';

export class KitchenTicketItemDto {
  @ApiProperty({ example: 'Hamburguesa' })
  @IsString()
  name: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Sin cebolla, extra queso' })
  @IsString()
  notes: string;
}

export class CreateKitchenTicketDto {
  @ApiProperty({
    description: 'ID de la orden',
    example: '60f7b2c6b4d1c23fbc1a9b10',
  })
  @IsMongoId()
  orderId: string;

  @ApiProperty({ type: [KitchenTicketItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KitchenTicketItemDto)
  items: KitchenTicketItemDto[];

  @ApiProperty({
    enum: KitchenTicketStatus,
    default: KitchenTicketStatus.PENDING,
  })
  @IsEnum(KitchenTicketStatus)
  status?: KitchenTicketStatus;

  @ApiProperty({ example: 1, description: 'Prioridad del ticket (1=alta)' })
  @IsInt()
  @Min(1)
  priority: number;

  @ApiProperty({
    description: 'ID de la sucursal',
    example: '60f7b2c6b4d1c23fbc1a9b02',
  })
  @IsMongoId()
  branchId: string;
}
