import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const doc = new this.productModel(dto);
    return doc.save();
  }

  async findAll(): Promise<Product[]> {
    const query = this.productModel
      .find()
      .populate('categoryId')
      .populate('branchId')
      .populate('extras')
      .populate('variants');
    const result = await query.exec();
    return result as unknown as Product[];
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('categoryId')
      .populate('branchId')
      .populate('extras')
      .populate('variants')
      .exec();
    if (!product) throw new NotFoundException('Product not found');
    return product as unknown as Product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('categoryId')
      .populate('branchId')
      .populate('extras')
      .populate('variants')
      .exec();
    if (!product) throw new NotFoundException('Product not found');
    return product as unknown as Product;
  }

  async remove(id: string): Promise<void> {
    const res = await this.productModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Product not found');
  }
}
