import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const doc = new this.categoryModel(dto);
    return doc.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().lean();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).lean();
    if (!category) throw new NotFoundException('Category not found');
    return category as unknown as Category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!category) throw new NotFoundException('Category not found');
    return category as unknown as Category;
  }

  async remove(id: string): Promise<void> {
    const res = await this.categoryModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Category not found');
  }
}
