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
import { KitchenTicketsService } from './kitchen-tickets.service';
import { CreateKitchenTicketDto } from './dto/create-kitchen-ticket.dto';
import { UpdateKitchenTicketDto } from './dto/update-kitchen-ticket.dto';

@ApiTags('kitchen-tickets')
@Controller('kitchen-tickets')
export class KitchenTicketsController {
  constructor(private readonly ticketsService: KitchenTicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear ticket de cocina' })
  @ApiResponse({ status: 201, description: 'Ticket creado' })
  @ApiBody({ type: CreateKitchenTicketDto })
  create(@Body() dto: CreateKitchenTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tickets de cocina' })
  @ApiResponse({ status: 200, description: 'Lista de tickets' })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ticket por ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Ticket encontrado' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ticket de cocina' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateKitchenTicketDto })
  @ApiResponse({ status: 200, description: 'Ticket actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateKitchenTicketDto) {
    return this.ticketsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar ticket de cocina' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Ticket eliminado' })
  async remove(@Param('id') id: string) {
    await this.ticketsService.remove(id);
    return { deleted: true };
  }
}
