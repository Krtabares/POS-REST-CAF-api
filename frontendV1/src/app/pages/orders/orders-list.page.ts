import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OrdersService } from './orders.service';
import { Order } from '../../models/order.model';
import { BranchService } from '../../layout/service/branch.service';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
    selector: 'app-orders-list',
    standalone: true,
    imports: [CommonModule, HttpClientModule, ButtonModule, ToolbarModule, TableModule, InputTextModule, InputIconModule, IconFieldModule],
    templateUrl: './orders-list.page.html'
})
export class OrdersListPage implements OnInit {
    orders: Order[] = [];
    currentBranchId?: string;
    @ViewChild('dt') dt!: Table;

    constructor(
        private ordersApi: OrdersService,
        private branchService: BranchService,
        private router: Router
    ) {
        effect(() => {
            const sel = this.branchService.selectedBranch();
            this.currentBranchId = sel?._id || undefined;
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.ordersApi.list().subscribe((items) => (this.orders = items || []));
    }

    filtered(): Order[] {
        if (!this.currentBranchId) return this.orders;
        return this.orders.filter((o) => {
            const bid = typeof o.branchId === 'string' ? o.branchId : (o.branchId as any)?._id;
            return bid === this.currentBranchId;
        });
    }

    formatDate(val?: string): string {
        if (!val) return '';
        const d = new Date(val);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
    }

    branchLabel(o: Order): string {
        const b = o.branchId as any;
        if (typeof o.branchId === 'string') return o.branchId as string;
        return (b?.name as string) || '';
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.dt.filterGlobal(value, 'contains');
    }

    edit(o: Order) {
        const id = (o as any)._id ?? (o as any).id;
        if (id) {
            this.router.navigate(['/orders', id]);
        }
    }
}
