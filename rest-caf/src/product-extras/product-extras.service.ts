import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductExtra,
  ProductExtraDocument,
} from './schemas/product-extra.schema';
import { CreateProductExtraDto } from './dto/create-product-extra.dto';
import { UpdateProductExtraDto } from './dto/update-product-extra.dto';

@Injectable()
export class ProductExtrasService {
  constructor(
    @InjectModel(ProductExtra.name)
    private readonly extraModel: Model<ProductExtraDocument>,
  ) {}

  async create(dto: CreateProductExtraDto): Promise<ProductExtra> {
    const doc = new this.extraModel(dto);
    return doc.save();
  }

  async findAll(): Promise<ProductExtra[]> {
    return this.extraModel.find().lean();
  }

  async findOne(id: string): Promise<ProductExtra> {
    const extra = await this.extraModel.findById(id).lean();
    if (!extra) throw new NotFoundException('Product extra not found');
    return extra as unknown as ProductExtra;
  }

  async update(id: string, dto: UpdateProductExtraDto): Promise<ProductExtra> {
    const extra = await this.extraModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!extra) throw new NotFoundException('Product extra not found');
    return extra as unknown as ProductExtra;
  }

  async remove(id: string): Promise<void> {
    const res = await this.extraModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Product extra not found');
  }
}
