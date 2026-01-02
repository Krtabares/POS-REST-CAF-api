import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../../models/payment.model';
import { Branch } from '../../models/branch.model';
import { Order } from '../../models/order.model';

export type CreatePaymentDto = {
    orderId: string;
    method: 'CASH' | 'CARD' | 'QR';
    amount: number;
    status?: 'PENDING' | 'PAID' | 'FAILED';
    paidAt?: string | Date | null;
    branchId: string;
};

export type UpdatePaymentDto = Partial<CreatePaymentDto>;

@Injectable({ providedIn: 'root' })
export class PaymentsService {
    private readonly baseUrl = 'http://localhost:3000/payments';
    private readonly ordersUrl = 'http://localhost:3000/orders';
    private readonly branchesUrl = 'http://localhost:3000/branches';

    constructor(private http: HttpClient) {}

    list(): Observable<Payment[]> {
        return this.http.get<Payment[]>(this.baseUrl);
    }

    get(id: string): Observable<Payment> {
        return this.http.get<Payment>(`${this.baseUrl}/${id}`);
    }

    create(dto: CreatePaymentDto): Observable<Payment> {
        return this.http.post<Payment>(this.baseUrl, dto);
    }

    update(id: string, dto: UpdatePaymentDto): Observable<Payment> {
        return this.http.patch<Payment>(`${this.baseUrl}/${id}`, dto);
    }

    remove(id: string): Observable<{ deleted: boolean }> {
        return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`);
    }

    listByOrderId(orderId: string): Observable<Payment[]> {
        return this.http.get<Payment[]>(`${this.baseUrl}?orderId=${orderId}`);
    }

    listOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.ordersUrl);
    }

    listBranches(): Observable<Branch[]> {
        return this.http.get<Branch[]>(this.branchesUrl);
    }
}
