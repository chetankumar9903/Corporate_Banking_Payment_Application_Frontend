import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-superadmin-dashboard',
  imports: [RouterLink,CommonModule,RouterModule],
  templateUrl: './superadmin-dashboard.html',
  styleUrl: './superadmin-dashboard.css',
})
export class SuperadminDashboard {

}
