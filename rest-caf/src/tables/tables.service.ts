import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table, TableDocument } from './schemas/table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name)
    private readonly tableModel: Model<TableDocument>,
  ) {}

  async create(dto: CreateTableDto): Promise<Table> {
    const doc = new this.tableModel(dto);
    return doc.save();
  }

  async findAll(): Promise<Table[]> {
    return this.tableModel.find().lean();
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.tableModel.findById(id).lean();
    if (!table) throw new NotFoundException('Table not found');
    return table as unknown as Table;
  }

  async update(id: string, dto: UpdateTableDto): Promise<Table> {
    const table = await this.tableModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!table) throw new NotFoundException('Table not found');
    return table as unknown as Table;
  }

  async remove(id: string): Promise<void> {
    const res = await this.tableModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Table not found');
  }
}
