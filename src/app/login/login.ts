import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSvc } from '../services/login-svc';
import { LoginViewModel } from '../models/LoginViewModel';
import { AuthResponseViewModel } from '../models/auth-response';
import { Role } from '../models/Role';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private svc: LoginSvc, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginUser(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const loginData: LoginViewModel = this.loginForm.value;

    this.svc.loginUser(loginData).subscribe({
      next: (res: AuthResponseViewModel) => {
        console.log('Login successful:', res);
        this.svc.saveToken(res);

        const role = res.role;
        switch (role) {
          case Role.SUPERADMIN:
            this.router.navigate(['/superadmin-dashboard']);
            break;
          case Role.BANKUSER:
            this.router.navigate(['/bank-dashboard']);
            break;
          case Role.CLIENTUSER:
            this.router.navigate(['/client-dashboard']);
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Invalid username or password';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}
