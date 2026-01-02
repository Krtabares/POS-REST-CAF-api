import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Branch } from '../../models/branch.model';

// DTOs for mutations should send IDs, not populated objects
export type CreateProductDto = {
    categoryId: string;
    name: string;
    description: string;
    basePrice: number;
    hasVariants?: boolean;
    hasExtras?: boolean;
    active?: boolean;
    branchId: string;
};
export type UpdateProductDto = Partial<CreateProductDto>;

@Injectable({ providedIn: 'root' })
export class ProductsService {
    private readonly baseUrl = 'http://localhost:3000/products';
    private readonly categoriesUrl = 'http://localhost:3000/categories';
    private readonly branchesUrl = 'http://localhost:3000/branches';

    constructor(private http: HttpClient) {}

    list(): Observable<Product[]> {
        return this.http.get<Product[]>(this.baseUrl);
    }

    get(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/${id}`);
    }

    create(dto: CreateProductDto): Observable<Product> {
        return this.http.post<Product>(this.baseUrl, dto);
    }

    update(id: string, dto: UpdateProductDto): Observable<Product> {
        return this.http.patch<Product>(`${this.baseUrl}/${id}`, dto);
    }

    remove(id: string): Observable<{ deleted: boolean }> {
        return this.http.delete<{ deleted: boolean }>(`${this.baseUrl}/${id}`);
    }

    // Helpers to fetch referenced collections
    listCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.categoriesUrl);
    }

    listBranches(): Observable<Branch[]> {
        return this.http.get<Branch[]>(this.branchesUrl);
    }
}
