import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear orden' })
  @ApiResponse({ status: 201, description: 'Orden creada' })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar órdenes' })
  @ApiQuery({
    name: 'orderId',
    required: false,
    description: 'Filtrar por ID de orden',
  })
  @ApiResponse({ status: 200, description: 'Lista de órdenes' })
  findAll(@Query('orderId') orderId?: string) {
    return this.ordersService.findAll({ orderId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener orden por ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar orden' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Orden actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar orden' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 204, description: 'Orden eliminada' })
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return { deleted: true };
  }
}
