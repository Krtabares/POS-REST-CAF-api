import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { Payment } from '../../../../models/payment.model';
import { Branch } from '../../../../models/branch.model';
import { Order } from '../../../../models/order.model';
import { CreatePaymentDto } from '../../payments.service';

@Component({
    selector: 'app-payment-form',
    standalone: true,
    imports: [CommonModule, FormsModule, InputNumberModule],
    templateUrl: './payment-form.component.html'
})
export class PaymentFormComponent {
    @Input() form!: CreatePaymentDto;
    @Input() orders: Order[] = [];
    @Input() branches: Branch[] = [];
    @Input() methods: Array<{ label: string; value: Payment['method'] }> = [];
}
