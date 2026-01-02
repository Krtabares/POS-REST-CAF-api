import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const doc = new this.customerModel(dto);
    return doc.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().lean();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).lean();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer as unknown as Customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer as unknown as Customer;
  }

  async remove(id: string): Promise<void> {
    const res = await this.customerModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Customer not found');
  }
}
