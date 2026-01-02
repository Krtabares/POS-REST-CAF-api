export interface ProductVariant {
    _id?: string;
    productId: string;
    name: string;
    priceModifier: number;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
