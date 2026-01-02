import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { CreateProductDto } from '../../products.service';
import { Category } from '../../../../models/category.model';
import { Branch } from '../../../../models/branch.model';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, TextareaModule, InputNumberModule, CheckboxModule],
    templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
    @Input() form!: CreateProductDto;
    @Input() categories: Category[] = [];
    @Input() branches: Branch[] = [];
}
