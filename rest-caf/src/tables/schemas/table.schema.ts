import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;

export enum TableStatus {
  FREE = 'FREE',
  OCCUPIED = 'OCCUPIED',
}

@Schema({ timestamps: true })
export class Table {
  _id: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  number: number;

  @Prop({ required: true, enum: TableStatus, default: TableStatus.FREE })
  status: TableStatus;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const TableSchema = SchemaFactory.createForClass(Table);
