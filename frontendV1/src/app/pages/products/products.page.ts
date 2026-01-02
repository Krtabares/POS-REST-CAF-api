import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductsService, CreateProductDto } from './products.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Branch } from '../../models/branch.model';
import { ProductFormComponent } from './components/form/product-form.component';
import { ProductsTableComponent } from './components/table/products-table.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        DialogModule,
        ConfirmDialogModule,
        InputIconModule,
        IconFieldModule,
        CheckboxModule,
        ProductFormComponent,
        ProductsTableComponent
    ],
    templateUrl: './products.page.html',
    providers: [MessageService, ConfirmationService]
})
export class ProductsPage implements OnInit {
    products = signal<Product[]>([]);
    selected: Product[] | null = null;

    categories: Category[] = [];
    branches: Branch[] = [];

    dialog = false;
    form: CreateProductDto = {
        name: '',
        description: '',
        basePrice: 0,
        categoryId: '',
        branchId: '',
        hasVariants: false,
        hasExtras: false,
        active: true
    };

    editingId?: string;

    constructor(
        private api: ProductsService,
        private messages: MessageService,
        private confirm: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.load();
        this.api.listCategories().subscribe((items) => (this.categories = items));
        this.api.listBranches().subscribe((items) => (this.branches = items));
    }

    load(): void {
        this.api.list().subscribe((items) => this.products.set(items));
    }

    openNew() {
        this.editingId = undefined;
        this.form = {
            name: '',
            description: '',
            basePrice: 0,
            categoryId: '',
            branchId: '',
            hasVariants: false,
            hasExtras: false,
            active: true
        };
        this.dialog = true;
    }

    formatRef(val: any): string {
        if (!val) return '';
        if (typeof val === 'string') return val;
        return (val.name ?? val._id ?? '').toString();
    }

    edit(item: Product) {
        this.editingId = item._id;
        const categoryId = typeof item.categoryId === 'string' ? item.categoryId : ((item.categoryId as any)?._id ?? '');
        const branchId = typeof item.branchId === 'string' ? item.branchId : ((item.branchId as any)?._id ?? '');
        this.form = {
            name: item.name,
            description: item.description,
            basePrice: item.basePrice,
            categoryId,
            branchId,
            hasVariants: !!item.hasVariants,
            hasExtras: !!item.hasExtras,
            active: item.active ?? true
        };
        this.dialog = true;
    }

    hideDialog() {
        this.dialog = false;
    }

    save() {
        if (!this.form.name?.trim() || !this.form.description?.trim()) {
            this.messages.add({ severity: 'warn', summary: 'Validation', detail: 'Name and Description are required', life: 2500 });
            return;
        }
        if (!this.form.categoryId?.trim() || !this.form.branchId?.trim()) {
            this.messages.add({ severity: 'warn', summary: 'Validation', detail: 'Category ID and Branch ID are required', life: 2500 });
            return;
        }

        if (this.editingId) {
            this.api.update(this.editingId, this.form).subscribe((updated) => {
                const list = this.products();
                const idx = list.findIndex((p) => p._id === updated._id);
                if (idx !== -1) list[idx] = updated;
                this.products.set([...list]);
                this.messages.add({ severity: 'success', summary: 'Updated', detail: 'Product updated', life: 3000 });
                this.dialog = false;
            });
        } else {
            this.api.create(this.form).subscribe((created) => {
                this.products.set([...this.products(), created]);
                this.messages.add({ severity: 'success', summary: 'Created', detail: 'Product created', life: 3000 });
                this.dialog = false;
            });
        }
    }

    deleteOne(item: Product) {
        this.confirm.confirm({
            message: `Delete product ${item.name}?`,
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (!item._id) return;
                this.api.remove(item._id).subscribe(() => {
                    this.products.set(this.products().filter((p) => p._id !== item._id));
                    this.messages.add({ severity: 'success', summary: 'Deleted', detail: 'Product deleted', life: 3000 });
                });
            }
        });
    }

    deleteSelected() {
        if (!this.selected || !this.selected.length) return;
        this.confirm.confirm({
            message: 'Delete selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = (this.selected || []).map((p) => p._id!).filter(Boolean);
                // Fire deletes sequentially; simple approach
                const toDelete = [...ids];
                const next = () => {
                    const id = toDelete.shift();
                    if (!id) {
                        this.selected = null;
                        this.products.set(this.products().filter((p) => !ids.includes(p._id!)));
                        this.messages.add({ severity: 'success', summary: 'Deleted', detail: 'Selected products deleted', life: 3000 });
                        return;
                    }
                    this.api.remove(id).subscribe({ next: () => next(), error: () => next() });
                };
                next();
            }
        });
    }
}
