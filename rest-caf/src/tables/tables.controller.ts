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
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@ApiTags('tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear mesa' })
  @ApiResponse({ status: 201, description: 'Mesa creada' })
  @ApiBody({ type: CreateTableDto })
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mesas' })
  @ApiResponse({ status: 200, description: 'Lista de mesas' })
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener mesa por ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Mesa encontrada' })
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar mesa' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateTableDto })
  @ApiResponse({ status: 200, description: 'Mesa actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateTableDto) {
    return this.tablesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar mesa' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Mesa eliminada' })
  async remove(@Param('id') id: string) {
    await this.tablesService.remove(id);
    return { deleted: true };
  }
}
