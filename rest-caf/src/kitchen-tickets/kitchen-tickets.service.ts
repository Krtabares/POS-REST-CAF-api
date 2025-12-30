import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  KitchenTicket,
  KitchenTicketDocument,
} from './schemas/kitchen-ticket.schema';
import { CreateKitchenTicketDto } from './dto/create-kitchen-ticket.dto';
import { UpdateKitchenTicketDto } from './dto/update-kitchen-ticket.dto';

@Injectable()
export class KitchenTicketsService {
  constructor(
    @InjectModel(KitchenTicket.name)
    private readonly ticketModel: Model<KitchenTicketDocument>,
  ) {}

  async create(dto: CreateKitchenTicketDto): Promise<KitchenTicket> {
    const doc = new this.ticketModel(dto);
    return doc.save();
  }

  async findAll(): Promise<KitchenTicket[]> {
    return this.ticketModel.find().lean();
  }

  async findOne(id: string): Promise<KitchenTicket> {
    const ticket = await this.ticketModel.findById(id).lean();
    if (!ticket) throw new NotFoundException('Kitchen ticket not found');
    return ticket as unknown as KitchenTicket;
  }

  async update(
    id: string,
    dto: UpdateKitchenTicketDto,
  ): Promise<KitchenTicket> {
    const ticket = await this.ticketModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!ticket) throw new NotFoundException('Kitchen ticket not found');
    return ticket as unknown as KitchenTicket;
  }

  async remove(id: string): Promise<void> {
    const res = await this.ticketModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Kitchen ticket not found');
  }
}
