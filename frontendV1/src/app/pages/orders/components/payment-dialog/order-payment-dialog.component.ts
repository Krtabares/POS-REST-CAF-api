import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PaymentsService, CreatePaymentDto } from '../../../payments/payments.service';
import { OrdersService, CreateOrderDto, CreateOrderItemDto } from '../../orders.service';
import { Payment } from '../../../../models/payment.model';

@Component({
    selector: 'app-order-payment-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, CheckboxModule, ToastModule],
    providers: [MessageService],
    templateUrl: './order-payment-dialog.component.html'
})
export class OrderPaymentDialogComponent {
    @Input() total = 0;
    @Input() method: Payment['method'] = 'CASH';
    @Input() orderLabel = '';
    @Input() orderNumber = 0;
    @Input() orderId?: string;
    @Input() branchId?: string;
    @Input() createdBy?: string;
    @Input() items: Array<{ productId: string; name: string; unitPrice: number; qty: number }> = [];
    @Input() subtotal = 0;
    @Input() tax = 0;

    @Output() finalize = new EventEmitter<{ payment?: Payment; details: { received: number; change: number; method: Payment['method']; total: number; print: boolean; email: boolean } }>();
    @Output() cancel = new EventEmitter<void>();

    received = 0;
    printReceipt = false;
    emailReceipt = false;

    constructor(
        private payments: PaymentsService,
        private orders: OrdersService,
        private messageService: MessageService
    ) {}

    setQuickAmount(amount: number) {
        this.received = amount;
    }

    exactAmount() {
        this.received = this.total;
    }

    change(): number {
        const diff = this.received - this.total;
        return diff >= 0 ? diff : 0;
    }

    async finalizeSale() {
        // Prevent creating payments with zero or negative amounts and show toast
        if (this.total <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Monto inválido', detail: 'El total debe ser mayor que cero.' });
            return;
        }
        if (this.received <= 0) {
            this.messageService.add({ severity: 'error', summary: 'Monto recibido inválido', detail: 'El monto recibido debe ser mayor que cero.' });
            return;
        }
        const status: Payment['status'] = 'PAID';
        const paidAt = new Date();
        let created: Payment | undefined;
        let ensuredOrderId = this.orderId;

        if (!ensuredOrderId && this.items.length > 0 && this.orderNumber > 0) {
            const orderItems: CreateOrderItemDto[] = this.items.map((it) => ({
                productId: it.productId,
                name: it.name,
                quantity: it.qty,
                unitPrice: it.unitPrice,
                total: it.unitPrice * it.qty
            }));
            const orderDto: CreateOrderDto = {
                orderNumber: this.orderNumber,
                type: 'TAKE_AWAY',
                status: 'CREATED',
                paymentStatus: 'PENDING',
                items: orderItems,
                subtotal: this.subtotal,
                tax: this.tax,
                total: this.total,
                createdBy: '694f57e7b51fd39530ac4b20',
                branchId: this.branchId || ''
            };
            try {
                const createdOrder = await this.orders.create(orderDto).toPromise();
                ensuredOrderId = createdOrder?._id;
            } catch (err) {
                // If order creation fails, continue without creating payment
            }
        }

        if (ensuredOrderId && this.branchId) {
            const dto: CreatePaymentDto = {
                orderId: ensuredOrderId,
                method: this.method,
                amount: this.received,
                status,
                paidAt,
                branchId: this.branchId
            };
            try {
                created = await this.payments.create(dto).toPromise();
            } catch (err) {
                // Emit without created payment on error, parent can handle
            }
        }

        this.finalize.emit({
            payment: created,
            details: {
                received: this.received,
                change: this.change(),
                method: this.method,
                total: this.total,
                print: this.printReceipt,
                email: this.emailReceipt
            }
        });
    }

    cancelSale() {
        this.cancel.emit();
    }
}
