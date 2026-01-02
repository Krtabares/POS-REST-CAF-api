import { Branch } from './branch.model';

export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

export interface Customer {
  _id?: string;
  type: CustomerType;
  name: string;
  lastName: string;
  documentId: string;
  email?: string | null;
  phone?: string | null;
  active?: boolean;
  notes?: string | null;
  branchId: string | Branch;
  createdAt?: string;
  updatedAt?: string;
}