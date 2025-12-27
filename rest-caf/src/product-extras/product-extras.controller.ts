import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductExtrasService } from './product-extras.service';
import { CreateProductExtraDto } from './dto/create-product-extra.dto';
import { UpdateProductExtraDto } from './dto/update-product-extra.dto';

@ApiTags('product-extras')
@Controller('product-extras')
export class ProductExtrasController {
  constructor(private readonly extrasService: ProductExtrasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear topping (extra) de producto' })
  @ApiResponse({ status: 201, description: 'Extra creado' })
  @ApiBody({ type: CreateProductExtraDto })
  create(@Body() dto: CreateProductExtraDto) {
    return this.extrasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar extras de producto' })
  @ApiResponse({ status: 200, description: 'Lista de extras' })
  findAll() {
    return this.extrasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener extra por ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Extra encontrado' })
  findOne(@Param('id') id: string) {
    return this.extrasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar extra de producto' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateProductExtraDto })
  @ApiResponse({ status: 200, description: 'Extra actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateProductExtraDto) {
    return this.extrasService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar extra de producto' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Extra eliminado' })
  async remove(@Param('id') id: string) {
    await this.extrasService.remove(id);
    return { deleted: true };
  }
}
