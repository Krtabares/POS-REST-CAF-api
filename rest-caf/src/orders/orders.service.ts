import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const doc = new this.orderModel(dto);
    return doc.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().lean();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).lean();
    if (!order) throw new NotFoundException('Order not found');
    return order as unknown as Order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!order) throw new NotFoundException('Order not found');
    return order as unknown as Order;
  }

  async remove(id: string): Promise<void> {
    const res = await this.orderModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Order not found');
  }
}
