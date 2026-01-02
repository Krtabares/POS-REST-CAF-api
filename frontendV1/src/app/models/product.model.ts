import { Category } from './category.model';
import { Branch } from './branch.model';
import { ProductExtra } from './product-extra.model';
import { ProductVariant } from './product-variant.model';

export interface Product {
    _id?: string;
    categoryId: string | Category;
    name: string;
    description: string;
    basePrice: number;
    hasVariants?: boolean;
    hasExtras?: boolean;
    active?: boolean;
    branchId: string | Branch;
    extras?: ProductExtra[];
    variants?: ProductVariant[];
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}
