import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const doc = new this.userModel({
      ...dto,
      branchId: new Types.ObjectId(dto.branchId),
    });
    return doc.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException('User not found');
    return user as unknown as User;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const update: any = { ...dto };
    if (dto.branchId) update.branchId = new Types.ObjectId(dto.branchId);
    const user = await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean();
    if (!user) throw new NotFoundException('User not found');
    return user as unknown as User;
  }

  async remove(id: string): Promise<void> {
    const res = await this.userModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('User not found');
  }
}
