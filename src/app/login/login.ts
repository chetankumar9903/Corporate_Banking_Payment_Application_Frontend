import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginSvc } from '../services/login-svc';
import { LoginViewModel } from '../models/LoginViewModel';
import { AuthResponseViewModel } from '../models/auth-response';
import { Role } from '../models/Role';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxCaptchaModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  errorMessage = '';
  loading = false;

  public readonly siteKey = "6Le7OwIsAAAAAGeocaZZFXNLjnb9SPhy6In4UUyH";

  constructor(private fb: FormBuilder, private svc: LoginSvc, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }
  
  constructor(private fb: FormBuilder, private svc: LoginSvc, private router: Router) {}

  loginUser(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please enter username, password, and check the CAPTCHA.";
      return;
    }

    this.loading = true;
    this.errorMessage = ''; // Clear old errors
    const formValue = this.loginForm.value;

    // --- THIS IS THE FIX ---
    // Manually map the form data to the view model
    // The form control is 'recaptcha', but the DTO expects 'recaptchaToken'
    const loginData: LoginViewModel = {
      userName: formValue.userName,
      password: formValue.password,
      recaptchaToken: formValue.recaptcha // Map here
    };
    // --- END OF FIX ---

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
        
        // --- ADD THIS LINE ---
        // Reset the CAPTCHA on a failed login
        this.loginForm.get('recaptcha')?.reset();
        // --- END OF ADDITION ---
      },
      complete: () => (this.loading = false)
    });
  }
}