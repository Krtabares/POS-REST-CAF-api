import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerType } from '../../models/customer.model';
import { Branch } from '../../models/branch.model';

export type CreateCustomerDto = {
  type: CustomerType;
  name: string;
  lastName: string;
  documentId: string;
  email?: string | null;
  phone?: string | null;
  active?: boolean;
  notes?: string | null;
  branchId: string;
};
export type UpdateCustomerDto = Partial<CreateCustomerDto>;

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private readonly baseUrl = 'http://localhost:3000/customers';
  private readonly branchesUrl = 'http://localhost:3000/branches';

  constructor(private http: HttpClient) {}

  list(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  get(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateCustomerDto): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateCustomerDto): Observable<Customer> {
    return this.http.patch<Customer>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: string): Observable<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`);
  }

  listBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.branchesUrl);
  }
}