import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { OrdersService } from '../orders/orders.service';
import { PaymentStatus as OrderPaymentStatus } from '../orders/schemas/order.schema';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
    private readonly ordersService: OrdersService,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const normalized = { ...dto } as any;
    if (normalized.paidAt) {
      normalized.paidAt = new Date(normalized.paidAt);
    }
    const doc = new this.paymentModel(normalized);
    const saved = await doc.save();
    // Validate and update order payment status after creating a payment
    if (saved?.orderId) {
      await this.validateOrderPaymentStatus(saved.orderId.toString());
    }
    return saved as unknown as Payment;
  }

  async findAll(filter?: { orderId?: string }): Promise<Payment[]> {
    const query: Record<string, any> = {};
    if (filter?.orderId) {
      try {
        query.orderId = filter.orderId;
      } catch {
        // If not a valid ObjectId, return empty set
        return [];
      }
    }
    return this.paymentModel.find(query).populate('orderId').lean();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentModel
      .findById(id)
      .populate('orderId')
      .lean();
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
    // Validate and update order payment status after updating a payment
    if ((payment as any)?.orderId) {
      await this.validateOrderPaymentStatus(
        ((payment as any).orderId as Types.ObjectId).toString(),
      );
    }
    return payment as unknown as Payment;
  }

  async remove(id: string): Promise<void> {
    const res = await this.paymentModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Payment not found');
    // Re-validate the order payment status after deleting a payment
    if (res?.orderId) {
      await this.validateOrderPaymentStatus(res.orderId.toString());
    }
  }

  /**
   * Validates an order's payment status by summing its payments.
   * If the sum of non-failed payments >= order.total, marks paymentStatus as PAID, else PENDING.
   */
  async validateOrderPaymentStatus(orderId: string): Promise<void> {
    this.logger.log(`Validating payment status for orderId=${orderId}`);
    // Load order to get total
    let order: any;
    try {
      order = await this.ordersService.findOne(orderId);
      if (!order) {
        this.logger.warn(`Order not found for id=${orderId}`);
        return;
      }
    } catch (err) {
      this.logger.error(
        `Error fetching order id=${orderId}`,
        (err as any)?.stack ?? String(err),
      );
      return;
    }
    this.logger.debug(
      `Order loaded: total=${order.total}, currentPaymentStatus=${order.paymentStatus}`,
    );

    // Sum payments for this order (exclude FAILED)
    const payments = await this.paymentModel
      .find({ orderId: orderId, status: { $ne: 'FAILED' } })
      .lean();
    this.logger.debug(
      `Payments found (excluding FAILED): count=${payments.length}`,
    );
    const totalPaid = (payments || []).reduce(
      (acc, p: any) => acc + (p.amount || 0),
      0,
    );
    this.logger.debug(`Total paid for order ${orderId}: ${totalPaid}`);

    let nextPaymentStatus: OrderPaymentStatus = OrderPaymentStatus.PENDING;
    if (totalPaid >= (order.total || 0)) {
      nextPaymentStatus = OrderPaymentStatus.PAID;
    } else if (totalPaid > 0) {
      // PARTIAL indicates some payment registered but not covering the total
      nextPaymentStatus =
        (OrderPaymentStatus as any).PARTIAL ?? OrderPaymentStatus.PENDING;
    }
    this.logger.log(
      `Next payment status for order ${orderId}: ${nextPaymentStatus}`,
    );
    if (nextPaymentStatus !== order.paymentStatus) {
      this.logger.log(
        `Updating order ${orderId} paymentStatus from ${order.paymentStatus} to ${nextPaymentStatus}`,
      );
      try {
        await this.ordersService.update(orderId, {
          paymentStatus: nextPaymentStatus,
        } as any);
        this.logger.log(`Order ${orderId} paymentStatus updated successfully.`);
      } catch (err) {
        this.logger.error(
          `Error updating order ${orderId} paymentStatus`,
          (err as any)?.stack ?? String(err),
        );
      }
    } else {
      this.logger.debug(
        `Order ${orderId} paymentStatus unchanged: remains ${order.paymentStatus}`,
      );
    }
  }
}
