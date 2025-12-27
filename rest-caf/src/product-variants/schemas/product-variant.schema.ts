import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

export enum VariantName {
  PEQUENO = 'Pequeño',
  MEDIANO = 'Mediano',
  GRANDE = 'Grande',
}

@Schema({ timestamps: true })
export class ProductVariant {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, enum: VariantName })
  name: VariantName;

  @Prop({ required: true })
  priceModifier: number;

  @Prop({ default: true })
  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
