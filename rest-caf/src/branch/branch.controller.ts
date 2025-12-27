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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@ApiTags('branches')
@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiOperation({ summary: 'Crear sucursal' })
  @ApiResponse({ status: 201, description: 'Sucursal creada' })
  @ApiBody({ type: CreateBranchDto })
  create(@Body() dto: CreateBranchDto) {
    return this.branchService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar sucursales' })
  @ApiResponse({ status: 200, description: 'Lista de sucursales' })
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener sucursal por ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Sucursal encontrada' })
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar sucursal' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateBranchDto })
  @ApiResponse({ status: 200, description: 'Sucursal actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar sucursal' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Sucursal eliminada' })
  async remove(@Param('id') id: string) {
    await this.branchService.remove(id);
    return { deleted: true };
  }
}
