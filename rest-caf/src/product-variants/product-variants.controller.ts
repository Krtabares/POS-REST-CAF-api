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
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@ApiTags('product-variants')
@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly variantsService: ProductVariantsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear variante de producto (tamaño)' })
  @ApiResponse({ status: 201, description: 'Variante creada' })
  @ApiBody({ type: CreateProductVariantDto })
  create(@Body() dto: CreateProductVariantDto) {
    return this.variantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar variantes de producto' })
  @ApiResponse({ status: 200, description: 'Lista de variantes' })
  findAll() {
    return this.variantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener variante por ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Variante encontrada' })
  findOne(@Param('id') id: string) {
    return this.variantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar variante de producto' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateProductVariantDto })
  @ApiResponse({ status: 200, description: 'Variante actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto) {
    return this.variantsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar variante de producto' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Variante eliminada' })
  async remove(@Param('id') id: string) {
    await this.variantsService.remove(id);
    return { deleted: true };
  }
}
