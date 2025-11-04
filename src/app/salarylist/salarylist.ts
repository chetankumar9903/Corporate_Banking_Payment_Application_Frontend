import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SalarySvc } from '../services/salary-svc';
import { LoginSvc } from '../services/login-svc';

@Component({
  selector: 'app-salarylist',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './salarylist.html',
  styleUrl: './salarylist.css',
})
export class Salarylist implements OnInit {
  salaries: any[] = [];
  loading = false;
  clientId: number | null = null;

  

  constructor(private svc: SalarySvc, private login: LoginSvc) {
    this.clientId = this.login.getClientId();
  }

  ngOnInit(): void {
    if (!this.clientId) return;
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.getByClientId(this.clientId!).subscribe({
      next: (res) => { this.salaries = res; this.loading = false; },
      error: () => { this.loading = false; alert('Failed to load salaries'); }
    });
  }

  onDelete(id: number) {
    if (!confirm('Delete this salary record?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.salaries = this.salaries.filter(s => s.salaryDisbursementId !== id); },
      error: () => alert('Failed to delete')
    });
  }

}
