import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentSvc } from '../services/payment-svc';
import { BeneficiarySvc } from '../services/beneficiary-svc';
import { Beneficiary } from '../models/Beneficiary';
import { CreatePaymentDto } from '../models/Payment';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-form.html',
  styleUrls: ['./payment-form.css']
})
export class PaymentForm implements OnInit {
  form!: FormGroup;
  beneficiaries: Beneficiary[] = [];
  clientId!: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private svc: PaymentSvc,
    private benSvc: BeneficiarySvc,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = localStorage.getItem('clientId');
    if (id) this.clientId = +id;

    this.form = this.fb.group({
      beneficiaryId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.loadBeneficiaries();
  }

  loadBeneficiaries() {
    if (!this.clientId) return;
    this.benSvc.getByClientId(this.clientId).subscribe({
      next: (data) => this.beneficiaries = data,
      error: (err) => console.error('Failed to load beneficiaries', err)
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    const dto: CreatePaymentDto = { ...this.form.value, clientId: this.clientId };
    this.svc.create(dto).subscribe({
      next: () => {
        alert('Payment created successfully');
        this.router.navigate(['/client-dashboard/payments']);
      },
      error: (err) => {
        console.error('Payment failed', err);
        this.loading = false;
         console.log('Error body:', err.error); // 👈 add this line
  alert(err.error?.message || 'Payment failed.');
      }
    });
  }
  goBack() {
  this.router.navigate(['/client-dashboard/payments']);
}
}
