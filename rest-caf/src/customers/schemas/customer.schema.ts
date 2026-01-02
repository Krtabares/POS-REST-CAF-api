import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

@Schema({ timestamps: true })
export class Customer {
  _id: Types.ObjectId;

  @Prop({ required: true, enum: CustomerType })
  type: CustomerType;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true })
  documentId: string;

  @Prop({ type: String, required: false, lowercase: true, trim: true })
  email?: string | null;

  @Prop({ type: String, required: false, trim: true })
  phone?: string | null;

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: String, required: false, trim: true })
  notes?: string | null;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
