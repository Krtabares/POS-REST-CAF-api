import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const normalized = { ...dto } as any;
    if (normalized.paidAt) {
      normalized.paidAt = new Date(normalized.paidAt);
    }
    const doc = new this.paymentModel(normalized);
    return doc.save();
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.find().lean();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).lean();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment as unknown as Payment;
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const normalized = { ...dto } as any;
    if (normalized.paidAt) {
      normalized.paidAt = new Date(normalized.paidAt);
    }
    const payment = await this.paymentModel
      .findByIdAndUpdate(id, normalized, { new: true })
      .lean();
    if (!payment) throw new NotFoundException('Payment not found');
    return payment as unknown as Payment;
  }

  async remove(id: string): Promise<void> {
    const res = await this.paymentModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Payment not found');
  }
}
