import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItem, OrderStatus, OrderType, OrderPaymentStatus } from '../../models/order.model';

export type CreateOrderItemDto = {
    productId: string;
    name?: string;
    variant?: { variantId: string; name?: string; priceModifier: number };
    extras?: Array<{ extraId: string; name?: string; price: number }>;
    quantity: number;
    unitPrice: number;
    total: number;
};

export type CreateOrderDto = {
    orderNumber: number;
    type: OrderType;
    tableId?: string;
    status: OrderStatus;
    paymentStatus: OrderPaymentStatus;
    items: CreateOrderItemDto[];
    subtotal: number;
    tax: number;
    total: number;
    createdBy?: string;
    branchId: string;
};

@Injectable({ providedIn: 'root' })
export class OrdersService {
    private readonly baseUrl = 'http://localhost:3000/orders';

    constructor(private http: HttpClient) {}

    create(dto: CreateOrderDto): Observable<Order> {
        return this.http.post<Order>(this.baseUrl, dto);
    }

    list(): Observable<Order[]> {
        return this.http.get<Order[]>(this.baseUrl);
    }

    get(id: string): Observable<Order> {
        return this.http.get<Order>(`${this.baseUrl}/${id}`);
    }
}
