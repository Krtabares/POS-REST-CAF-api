import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { CreateCustomerDto } from '../../customers.service';
import { Branch } from '../../../../models/branch.model';
import { CustomerType } from '../../../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, TextareaModule, CheckboxModule],
  templateUrl: './customer-form.component.html',
})
export class CustomerFormComponent {
  @Input() form!: CreateCustomerDto;
  @Input() branches: Branch[] = [];
  @Input() types: CustomerType[] = ['INDIVIDUAL', 'COMPANY'];
}