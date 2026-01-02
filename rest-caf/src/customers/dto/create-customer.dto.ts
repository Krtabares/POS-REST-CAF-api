import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { CustomerType } from '../schemas/customer.schema';

export class CreateCustomerDto {
  @ApiProperty({ enum: CustomerType, example: CustomerType.INDIVIDUAL })
  @IsEnum(CustomerType)
  type: CustomerType;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Perez' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'DNI-12345678' })
  @IsString()
  documentId: string;

  @ApiProperty({ example: 'juan.perez@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiProperty({ example: '+51 999 888 777', required: false })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ example: 'Cliente preferente', required: false })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiProperty({ description: 'ID de la sucursal' })
  @IsMongoId()
  branchId: string;
}
