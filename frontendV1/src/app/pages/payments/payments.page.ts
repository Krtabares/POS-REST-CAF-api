import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PaymentsService, CreatePaymentDto } from './payments.service';
import { Payment } from '../../models/payment.model';
import { Branch } from '../../models/branch.model';
import { Order } from '../../models/order.model';
import { PaymentFormComponent } from './components/form/payment-form.component';
import { PaymentMethod } from '../../models/payment.model';

@Component({
    selector: 'app-payments',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, RippleModule, ToastModule, ToolbarModule, InputTextModule, InputNumberModule, DialogModule, ConfirmDialogModule, CheckboxModule, PaymentFormComponent],
    templateUrl: './payments.page.html',
    providers: [MessageService, ConfirmationService]
})
export class PaymentsPage implements OnInit {
    payments = signal<Payment[]>([]);
    selected: Payment[] | null = null;

    orders: Order[] = [];
    branches: Branch[] = [];

    dialog = false;
    form: CreatePaymentDto = {
        orderId: '',
        method: 'CASH',
        amount: 0,
        status: 'PENDING',
        paidAt: null,
        branchId: ''
    };

    editingId?: string;

    methods: Array<{ label: string; value: PaymentMethod }> = [
        { label: 'Cash', value: 'CASH' },
        { label: 'Card', value: 'CARD' },
        { label: 'QR', value: 'QR' }
    ];

    constructor(
        private api: PaymentsService,
        private messages: MessageService,
        private confirm: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.load();
        this.api.listOrders().subscribe((items) => (this.orders = items));
        this.api.listBranches().subscribe((items) => (this.branches = items));
    }

    load(): void {
        this.api.list().subscribe((items) => this.payments.set(items));
    }

    openNew() {
        this.editingId = undefined;
        this.form = {
            orderId: '',
            method: 'CASH',
            amount: 0,
            status: 'PENDING',
            paidAt: null,
            branchId: ''
        };
        this.dialog = true;
    }

    hideDialog() {
        this.dialog = false;
    }

    formatRef(val: any): string {
        if (!val) return '';
        if (typeof val === 'string') return val;
        return (val.orderNumber ?? val.name ?? val._id ?? '').toString();
    }

    formatBranch(val: any): string {
        if (!val) return '';
        if (typeof val === 'string') return val;
        return (val.name ?? val._id ?? '').toString();
    }

    edit(item: Payment) {
        this.editingId = item._id;
        const orderId = typeof item.orderId === 'string' ? item.orderId : ((item.orderId as any)?._id ?? '');
        const branchId = typeof item.branchId === 'string' ? item.branchId : ((item.branchId as any)?._id ?? '');
        this.form = {
            orderId,
            method: item.method,
            amount: item.amount,
            status: item.status,
            paidAt: item.paidAt || null,
            branchId
        };
        this.dialog = true;
    }

    save() {
        if (!this.form.orderId?.trim()) {
            this.messages.add({ severity: 'warn', summary: 'Validation', detail: 'Order is required', life: 2500 });
            return;
        }
        if (!this.form.branchId?.trim()) {
            this.messages.add({ severity: 'warn', summary: 'Validation', detail: 'Branch is required', life: 2500 });
            return;
        }
        if (!this.form.amount || this.form.amount <= 0) {
            this.messages.add({ severity: 'warn', summary: 'Validation', detail: 'Amount must be greater than 0', life: 2500 });
            return;
        }

        if (this.editingId) {
            this.api.update(this.editingId, this.form).subscribe((updated) => {
                const list = this.payments();
                const idx = list.findIndex((p) => p._id === updated._id);
                if (idx !== -1) list[idx] = updated;
                this.payments.set([...list]);
                this.messages.add({ severity: 'success', summary: 'Updated', detail: 'Payment updated', life: 3000 });
                this.dialog = false;
            });
        } else {
            this.api.create(this.form).subscribe((created) => {
                this.payments.set([...this.payments(), created]);
                this.messages.add({ severity: 'success', summary: 'Created', detail: 'Payment created', life: 3000 });
                this.dialog = false;
            });
        }
    }

    deleteOne(item: Payment) {
        this.confirm.confirm({
            message: `Delete payment ${item._id}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (!item._id) return;
                this.api.remove(item._id).subscribe(() => {
                    this.payments.set(this.payments().filter((p) => p._id !== item._id));
                    this.messages.add({ severity: 'success', summary: 'Deleted', detail: 'Payment deleted', life: 3000 });
                });
            }
        });
    }

    deleteSelected() {
        if (!this.selected || !this.selected.length) return;
        this.confirm.confirm({
            message: 'Delete selected payments?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = (this.selected || []).map((p) => p._id!).filter(Boolean);
                const toDelete = [...ids];
                const next = () => {
                    const id = toDelete.shift();
                    if (!id) {
                        this.selected = null;
                        this.payments.set(this.payments().filter((p) => !ids.includes(p._id!)));
                        this.messages.add({ severity: 'success', summary: 'Deleted', detail: 'Selected payments deleted', life: 3000 });
                        return;
                    }
                    this.api.remove(id).subscribe({ next: () => next(), error: () => next() });
                };
                next();
            }
        });
    }
}
