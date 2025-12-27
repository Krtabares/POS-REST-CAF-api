import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Sucursal Centro' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Av. Principal 123, Ciudad' })
  @IsString()
  address: string;

  @ApiProperty({ example: '+52 55 1234 5678' })
  @IsString()
  phone: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
