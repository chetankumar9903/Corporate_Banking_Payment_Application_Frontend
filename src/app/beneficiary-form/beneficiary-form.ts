import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BeneficiarySvc } from '../services/beneficiary-svc';
import { CreateBeneficiaryDto, UpdateBeneficiaryDto } from '../models/Beneficiary';

@Component({
  selector: 'app-beneficiary-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './beneficiary-form.html',
  styleUrls: ['./beneficiary-form.css'],
})
export class BeneficiaryForm implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  id!: number;
  loading = false;
  clientId!: number;

  constructor(
    private fb: FormBuilder,
    private svc: BeneficiarySvc,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = +localStorage.getItem('clientId')!;
    this.id = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.id;

    this.form = this.fb.group({
      beneficiaryName: ['', [Validators.required, Validators.maxLength(100)]],
      accountNumber: ['', [Validators.required, Validators.maxLength(20)]],
      bankName: ['', [Validators.required, Validators.maxLength(50)]],
      branch: [''],
      ifscCode: [''],
       email: ['', [Validators.email]],
  phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
      address: [''],
      isActive: [true],
    });

    if (this.isEditMode) this.loadBeneficiary();
  }

  loadBeneficiary() {
    this.svc.getById(this.id).subscribe({
      next: (data) => this.form.patchValue(data),
      error: (err) => console.error('Failed to load beneficiary', err),
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;

    if (this.isEditMode) {
      const dto: UpdateBeneficiaryDto = this.form.value;
      this.svc.update(this.id, dto).subscribe({
        next: () => {
          alert('Beneficiary updated successfully');
          this.router.navigate(['/client-dashboard/beneficiaries']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    } else {
      if (!this.clientId) {
      alert('Client ID not found. Please re-login.');
      this.loading = false;
      return;
    }
      const dto: CreateBeneficiaryDto = { ...this.form.value, clientId: this.clientId };
      this.svc.create(dto).subscribe({
        next: () => {
          alert('Beneficiary added successfully');
          this.router.navigate(['/client-dashboard/beneficiaries']);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }
}
