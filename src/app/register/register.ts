import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Role } from '../models/Role';
import { RegisterSvc } from '../services/register-svc';
import { CreateUserDto } from '../models/User';

@Component({
  selector: 'app-register',
   standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm!: FormGroup;
  loading = false;

   toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  toastShow = false;

  userRole = Role;
   showPassword = false;

  constructor(private fb: FormBuilder, private userSvc: RegisterSvc, private router: Router) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
  userName: ['', [Validators.required, Validators.maxLength(50)]],
  password: ['', [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern(/^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)
  ]],
  firstName: ['', [Validators.required, Validators.maxLength(50)]],
  lastName: ['', [Validators.required, Validators.maxLength(50)]],
  emailId: ['', [Validators.required, Validators.email]],
  phoneNumber: ['', [
    Validators.required,
    Validators.pattern(/^\d{10}$/) 
  ]],
  address: ['', [Validators.required, Validators.maxLength(200)]],
  userRole: [Role.CLIENTUSER, Validators.required]
});
  }

   togglePassword() {
    this.showPassword = !this.showPassword;
  }

  registerUser(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    const dto: CreateUserDto = this.registerForm.value;
console.log('Register payload:', dto); // << check this

    this.userSvc.createUser(dto).subscribe({
      next: (res) => {
        this.showToast(`User ${dto.userName} registered successfully!`, 'success');
        this.registerForm.reset({ userRole: Role.BANKUSER });
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      
      },
      error: (err) => {
       this.showToast(err.error?.message || 'Failed to create user', 'error');
        this.loading = false;
      }
    });
  }

   showToast(message: string, type: 'success' | 'error', duration = 4000) {
    this.toastMessage = message;
    this.toastType = type;
    this.toastShow = true;

    setTimeout(() => this.toastShow = false, duration);
  }
}
