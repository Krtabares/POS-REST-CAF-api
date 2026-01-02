import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CustomersService, CreateCustomerDto } from './customers.service';
import { Customer, CustomerType } from '../../models/customer.model';
import { Branch } from '../../models/branch.model';
import { CustomerFormComponent } from './components/form/customer-form.component';
import { CustomersTableComponent } from './components/table/customers-table.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    TextareaModule,
    DialogModule,
    ConfirmDialogModule,
    InputIconModule,
    IconFieldModule,
    CheckboxModule,
    CustomerFormComponent,
    CustomersTableComponent,
  ],
  templateUrl: './customers.page.html',
  providers: [MessageService, ConfirmationService],
})
export class CustomersPage implements OnInit {
  customers = signal<Customer[]>([]);
  selected: Customer[] | null = null;

  branches: Branch[] = [];

  dialog = false;
  form: CreateCustomerDto = {
    type: 'INDIVIDUAL',
    name: '',
    lastName: '',
    documentId: '',
    email: null,
    phone: null,
    active: true,
    notes: null,
    branchId: '',
  };

  editingId?: string;

  readonly types: CustomerType[] = ['INDIVIDUAL', 'COMPANY'];

  constructor(
    private api: CustomersService,
    private messages: MessageService,
    private confirm: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.api.listBranches().subscribe((items) => (this.branches = items));
  }

  load(): void {
    this.api.list().subscribe((items) => this.customers.set(items));
  }

  openNew() {
    this.editingId = undefined;
    this.form = {
      type: 'INDIVIDUAL',
      name: '',
      lastName: '',
      documentId: '',
      email: null,
      phone: null,
      active: true,
      notes: null,
      branchId: '',
    };
    this.dialog = true;
  }

  formatRef(val: any): string {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return (val.name ?? val._id ?? '').toString();
  }

  edit(item: Customer) {
    this.editingId = item._id;
    const branchId =
      typeof item.branchId === 'string'
        ? item.branchId
        : (item.branchId as any)?._id ?? '';
    this.form = {
      type: item.type,
      name: item.name,
      lastName: item.lastName,
      documentId: item.documentId,
      email: item.email ?? null,
      phone: item.phone ?? null,
      active: item.active ?? true,
      notes: item.notes ?? null,
      branchId,
    };
    this.dialog = true;
  }

  hideDialog() {
    this.dialog = false;
  }

  save() {
    if (!this.form.name?.trim() || !this.form.lastName?.trim() || !this.form.documentId?.trim()) {
      this.messages.add({ severity: 'warn', summary: 'Validation', detail: 'Name, Last Name and Document ID are required', life: 2500 });
      return;
    }
    if (!this.form.branchId?.trim()) {
      this.messages.add({ severity: 'warn', summary: 'Validation', detail: 'Branch ID is required', life: 2500 });
      return;
    }

    if (this.editingId) {
      this.api.update(this.editingId, this.form).subscribe((updated) => {
        const list = this.customers();
        const idx = list.findIndex((c) => c._id === updated._id);
        if (idx !== -1) list[idx] = updated;
        this.customers.set([...list]);
        this.messages.add({ severity: 'success', summary: 'Updated', detail: 'Customer updated', life: 3000 });
        this.dialog = false;
      });
    } else {
      this.api.create(this.form).subscribe((created) => {
        this.customers.set([...this.customers(), created]);
        this.messages.add({ severity: 'success', summary: 'Created', detail: 'Customer created', life: 3000 });
        this.dialog = false;
      });
    }
  }

  deleteOne(item: Customer) {
    this.confirm.confirm({
      message: `Delete customer ${item.name} ${item.lastName}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!item._id) return;
        this.api.remove(item._id).subscribe(() => {
          this.customers.set(this.customers().filter((c) => c._id !== item._id));
          this.messages.add({ severity: 'success', summary: 'Deleted', detail: 'Customer deleted', life: 3000 });
        });
      },
    });
  }

  deleteSelected() {
    if (!this.selected || !this.selected.length) return;
    this.confirm.confirm({
      message: 'Delete selected customers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = (this.selected || []).map((c) => c._id!).filter(Boolean);
        const toDelete = [...ids];
        const next = () => {
          const id = toDelete.shift();
          if (!id) {
            this.selected = null;
            this.customers.set(this.customers().filter((c) => !ids.includes(c._id!)));
            this.messages.add({ severity: 'success', summary: 'Deleted', detail: 'Selected customers deleted', life: 3000 });
            return;
          }
          this.api.remove(id).subscribe({ next: () => next(), error: () => next() });
        };
        next();
      },
    });
  }
}