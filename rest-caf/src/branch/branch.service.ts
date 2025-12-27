import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from './schemas/branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchModel: Model<BranchDocument>,
  ) {}

  async create(dto: CreateBranchDto): Promise<Branch> {
    const doc = new this.branchModel(dto);
    return doc.save();
  }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().lean();
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchModel.findById(id).lean();
    if (!branch) throw new NotFoundException('Branch not found');
    return branch as unknown as Branch;
  }

  async update(id: string, dto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.branchModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!branch) throw new NotFoundException('Branch not found');
    return branch as unknown as Branch;
  }

  async remove(id: string): Promise<void> {
    const res = await this.branchModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Branch not found');
  }
}
