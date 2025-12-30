import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type KitchenTicketDocument = HydratedDocument<KitchenTicket>;

export enum KitchenTicketStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
}

@Schema()
export class KitchenTicketItem {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, trim: true })
  notes: string;
}

export const KitchenTicketItemSchema =
  SchemaFactory.createForClass(KitchenTicketItem);

@Schema({ timestamps: true })
export class KitchenTicket {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: [KitchenTicketItemSchema], default: [] })
  items: KitchenTicketItem[];

  @Prop({
    required: true,
    enum: KitchenTicketStatus,
    default: KitchenTicketStatus.PENDING,
  })
  status: KitchenTicketStatus;

  @Prop({ required: true, min: 1 })
  priority: number;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const KitchenTicketSchema = SchemaFactory.createForClass(KitchenTicket);
