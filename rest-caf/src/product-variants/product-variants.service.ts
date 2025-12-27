import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductVariant,
  ProductVariantDocument,
} from './schemas/product-variant.schema';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectModel(ProductVariant.name)
    private readonly variantModel: Model<ProductVariantDocument>,
  ) {}

  async create(dto: CreateProductVariantDto): Promise<ProductVariant> {
    const doc = new this.variantModel(dto);
    return doc.save();
  }

  async findAll(): Promise<ProductVariant[]> {
    return this.variantModel.find().lean();
  }

  async findOne(id: string): Promise<ProductVariant> {
    const variant = await this.variantModel.findById(id).lean();
    if (!variant) throw new NotFoundException('Product variant not found');
    return variant as unknown as ProductVariant;
  }

  async update(
    id: string,
    dto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.variantModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!variant) throw new NotFoundException('Product variant not found');
    return variant as unknown as ProductVariant;
  }

  async remove(id: string): Promise<void> {
    const res = await this.variantModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Product variant not found');
  }
}
