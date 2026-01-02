import { Branch } from './branch.model';

export type OrderType = 'DINE_IN' | 'TAKE_AWAY';
export type OrderStatus = 'CREATED' | 'SENT_TO_KITCHEN' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type OrderPaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'CANCELLED';

export interface OrderItemExtra {
    extraId: string;
    name: string;
    price: number;
}

export interface OrderItemVariant {
    variantId: string;
    name: string;
    priceModifier: number;
}

export interface OrderItem {
    productId: string;
    name: string;
    variant?: OrderItemVariant;
    extras?: OrderItemExtra[];
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface Order {
    _id?: string;
    orderNumber: number;
    type: OrderType;
    tableId?: string | null;
    status: OrderStatus;
    paymentStatus: OrderPaymentStatus;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    createdBy: string;
    branchId: string | Branch;
    createdAt?: string;
    updatedAt?: string;
}
