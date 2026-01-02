import { Branch } from './branch.model';
import { Order } from './order.model';

export type PaymentMethod = 'CASH' | 'CARD' | 'QR';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface Payment {
    _id?: string;
    orderId: string | Order;
    method: PaymentMethod;
    amount: number;
    status: PaymentStatus;
    paidAt?: string | null;
    branchId: string | Branch;
    createdAt?: string;
    updatedAt?: string;
}
