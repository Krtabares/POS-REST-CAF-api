import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CheckboxModule } from 'primeng/checkbox';
import { Customer } from '../../../../models/customer.model';

@Component({
  selector: 'app-customers-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RippleModule, InputTextModule, InputIconModule, IconFieldModule, CheckboxModule],
  template: `
        <p-table
            #dt
            [value]="customers"
            [rows]="10"
            [paginator]="true"
            [globalFilterFields]="['name', 'lastName', 'documentId', 'email', 'phone', 'type', 'branchId', 'branchId.name']"
            [tableStyle]="{ 'min-width': '75rem' }"
            [(selection)]="selection"
            (selectionChange)="selectionChange.emit($event)"
            [rowHover]="true"
            dataKey="_id"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
        >
            <ng-template #caption>
                <div class="flex items-center justify-between">
                    <h5 class="m-0">Customers</h5>
                    <p-iconfield>
                        <p-inputicon styleClass="pi pi-search" />
                        <input pInputText type="text" (input)="onGlobalFilter($event)" placeholder="Search..." />
                    </p-iconfield>
                </div>
            </ng-template>
            <ng-template #header>
                <tr>
                    <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                    <th style="min-width: 12rem">Name</th>
                    <th style="min-width: 12rem">Last Name</th>
                    <th style="min-width: 10rem">Type</th>
                    <th style="min-width: 16rem">Document ID</th>
                    <th style="min-width: 18rem">Email</th>
                    <th style="min-width: 14rem">Phone</th>
                    <th style="min-width: 14rem">Branch</th>
                    <th style="min-width: 8rem">Active</th>
                    <th style="min-width: 12rem"></th>
                </tr>
            </ng-template>
            <ng-template #body let-item>
                <tr>
                    <td style="width: 3rem"><p-tableCheckbox [value]="item" /></td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.lastName }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.documentId }}</td>
                    <td>{{ item.email || '' }}</td>
                    <td>{{ item.phone || '' }}</td>
                    <td>{{ formatRef(item.branchId) }}</td>
                    <td>{{ item.active ? 'Yes' : 'No' }}</td>
                    <td>
                        <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editItem.emit(item)" />
                        <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="deleteItem.emit(item)" />
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
})
export class CustomersTableComponent {
  @Input() customers: Customer[] = [];
  @Input() selection: Customer[] | null = null;
  @Output() selectionChange = new EventEmitter<Customer[] | null>();
  @Output() editItem = new EventEmitter<Customer>();
  @Output() deleteItem = new EventEmitter<Customer>();

  @ViewChild('dt') dt!: Table;

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(value, 'contains');
  }

  formatRef(val: any): string {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return (val.name ?? val._id ?? '').toString();
  }
}