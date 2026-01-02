import { Branch } from './branch.model';

export interface Category {
    _id?: string;
    name: string;
    order: number;
    active?: boolean;
    branchId: string | Branch;
    createdAt?: string;
    updatedAt?: string;
}
