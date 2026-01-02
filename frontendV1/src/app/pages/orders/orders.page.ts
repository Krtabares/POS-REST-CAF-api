import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { OrderPaymentDialogComponent } from './components/payment-dialog/order-payment-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from '../products/products.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Payment, PaymentMethod } from '../../models/payment.model';
import { OrdersService, CreateOrderDto, CreateOrderItemDto } from './orders.service';
import { PaymentsService } from '../payments/payments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from '@/services/branch.service';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, ButtonModule, RippleModule, HttpClientModule, DialogModule, OrderPaymentDialogComponent],
    templateUrl: './orders.page.html'
})
export class OrdersPage implements OnInit {
    categories: Category[] = [];
    selectedCategoryId?: string;
    products: Product[] = [];
    ticketNumber = Math.floor(Date.now() % 10000);
    orderItems: Array<{ productId: string; name: string; unitPrice: number; qty: number }> = [];
    taxRate = 0.08;
    discountAmount = 0;
    paymentDialog = false;
    paymentMethod: 'CASH' | 'CARD' | 'QR' = 'CASH';
    currentOrderId?: string;
    currentBranchId?: string;
    currentUserId?: string;
    orderPayments: Array<{ method: PaymentMethod; amount: number; paidAt?: string | null }> = [];

    constructor(
        private api: ProductsService,
        private branchService: BranchService,
        private ordersService: OrdersService,
        private paymentsService: PaymentsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        effect(() => {
            const sel = this.branchService.selectedBranch();
            this.currentBranchId = sel?._id || undefined;
        });
    }

    ngOnInit(): void {
        // Initialize from current branch selection
        const sel = this.branchService.selectedBranch();
        this.currentBranchId = sel?._id || undefined;

        this.api.listCategories().subscribe((items) => {
            this.categories = items;
            if (!this.selectedCategoryId && items.length) {
                this.selectedCategoryId = items[0]._id!;
            }
        });

        this.api.list().subscribe((items) => {
            this.products = items;
        });

        // Read order id from route if present and load it
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id') || undefined;
            if (id && id !== this.currentOrderId) {
                this.currentOrderId = id;
                this.loadOrderById(id);
                this.loadPaymentsForOrder(id);
            }
        });
    }

    selectCategory(id?: string) {
        if (!id) return;
        this.selectedCategoryId = id;
    }

    filteredProducts() {
        const catId = this.selectedCategoryId;
        if (!catId) return [];
        return this.products.filter((p) => {
            const pid = typeof p.categoryId === 'string' ? p.categoryId : (p.categoryId as Category)._id;
            return pid === catId;
        });
    }

    addProduct(product: Product) {
        const id = this.getProductId(product);
        const idx = this.orderItems.findIndex((it) => it.productId === id);
        if (idx >= 0) {
            this.orderItems[idx].qty += 1;
        } else {
            this.orderItems.push({ productId: id, name: product.name, unitPrice: product.basePrice, qty: 1 });
        }
    }

    incrementQty(item: { productId: string; qty: number }) {
        const idx = this.orderItems.findIndex((it) => it.productId === item.productId);
        if (idx >= 0) this.orderItems[idx].qty += 1;
    }

    decrementQty(item: { productId: string; qty: number }) {
        const idx = this.orderItems.findIndex((it) => it.productId === item.productId);
        if (idx >= 0) {
            const next = this.orderItems[idx].qty - 1;
            if (next <= 0) this.orderItems.splice(idx, 1);
            else this.orderItems[idx].qty = next;
        }
    }

    removeItem(item: { productId: string }) {
        this.orderItems = this.orderItems.filter((it) => it.productId !== item.productId);
    }

    ticketLabel(): string {
        return `#${this.ticketNumber.toString().padStart(4, '0')}`;
    }

    private getProductId(product: Product): string {
        return product._id || `${product.name}-${product.basePrice}`;
    }

    // Summary calculations
    subtotal(): number {
        return this.orderItems.reduce((acc, it) => acc + it.unitPrice * it.qty, 0);
    }

    discount(): number {
        return this.discountAmount;
    }

    taxes(): number {
        return this.subtotal() * this.taxRate;
    }

    totalToPay(): number {
        return this.subtotal() - this.discount() + this.taxes();
    }

    totalPaid(): number {
        return this.orderPayments.reduce((acc, p) => acc + p.amount, 0);
    }

    remainingToPay(): number {
        const remaining = this.totalToPay() - this.totalPaid();
        return remaining > 0 ? remaining : 0;
    }

    // Actions (stubs)
    payCash() {
        this.paymentMethod = 'CASH';
        this.paymentDialog = true;
    }

    splitBill() {
        console.log('Dividir cuenta', { total: this.totalToPay(), items: this.orderItems });
    }

    async saveOrder() {
        console.log('Guardar orden para posterior', { ticket: this.ticketLabel(), items: this.orderItems });
        const ensuredId = await this.ensureOrderCreated();
        if (ensuredId) {
            this.router.navigate(['orders', ensuredId]);
        } else {
        }
    }

    cancelOrder() {
        this.orderItems = [];
        this.orderPayments = [];
        console.log('Orden cancelada');
    }

    newOrder() {
        this.orderItems = [];
        this.ticketNumber = Math.floor(Date.now() % 10000);
        this.orderPayments = [];
        console.log('Nueva orden creada', { ticket: this.ticketLabel() });
    }

    finalizePayment(evt: { payment?: Payment; details: { received: number; change: number; method: PaymentMethod; total: number; print: boolean; email: boolean } }) {
        this.paymentDialog = false;
        if (evt?.payment) {
            console.log('Pago registrado', evt.payment);
            // Persist payment in the local list for display
            this.orderPayments.push({ amount: evt.payment.amount, method: evt.payment.method, paidAt: evt.payment.paidAt ?? null });
            // Track current order id if provided
            if (evt.payment.orderId && typeof evt.payment.orderId === 'string') {
                this.currentOrderId = evt.payment.orderId;
            }
        }
        // Reset order after successful payment if paid fully
        if (evt?.details?.received >= this.totalToPay()) {
            this.newOrder();
        } else {
            // Partial payment: ensure route carries the order id for editing
            if (this.currentOrderId) {
                this.router.navigate(['orders', this.currentOrderId]);
            }
        }
    }

    cancelPayment() {
        this.paymentDialog = false;
    }

    private async ensureOrderCreated(): Promise<string | undefined> {
        if (this.currentOrderId) return this.currentOrderId;
        if (!this.currentBranchId || this.orderItems.length === 0) return undefined;
        const orderItems: CreateOrderItemDto[] = this.orderItems.map((it) => ({
            productId: it.productId,
            name: it.name,
            quantity: it.qty,
            unitPrice: it.unitPrice,
            total: it.unitPrice * it.qty
        }));
        const dto: CreateOrderDto = {
            orderNumber: this.ticketNumber,
            type: 'TAKE_AWAY',
            status: 'CREATED',
            paymentStatus: 'PENDING',
            items: orderItems,
            subtotal: this.subtotal(),
            tax: this.taxes(),
            total: this.totalToPay(),
            createdBy: this.currentUserId || 'anonymous',
            branchId: this.currentBranchId
        };
        try {
            const created = await this.ordersService.create(dto).toPromise();
            this.currentOrderId = created?._id;
            return this.currentOrderId;
        } catch (err) {
            console.error('Error creando orden:', err);
            return undefined;
        }
    }

    private loadOrderById(id: string) {
        this.ordersService.get(id).subscribe({
            next: (order) => {
                if (!order) return;
                this.currentOrderId = order._id || id;
                this.ticketNumber = order.orderNumber ?? this.ticketNumber;
                this.orderItems = (order.items || []).map((it) => ({
                    productId: it.productId,
                    name: it.name,
                    unitPrice: it.unitPrice,
                    qty: it.quantity
                }));
                // Derive tax rate from loaded order if possible
                this.taxRate = order.subtotal > 0 ? order.tax / order.subtotal : this.taxRate;
                this.discountAmount = 0;
            },
            error: (err) => {
                console.error('No se pudo cargar la orden', err);
            }
        });
    }

    private loadPaymentsForOrder(id: string) {
        this.paymentsService.listByOrderId(id).subscribe({
            next: (items) => {
                this.orderPayments = (items || []).map((p) => ({ amount: p.amount, method: p.method, paidAt: p.paidAt ?? null }));
            },
            error: (err) => {
                console.error('No se pudieron cargar los pagos de la orden', err);
            }
        });
    }
}
