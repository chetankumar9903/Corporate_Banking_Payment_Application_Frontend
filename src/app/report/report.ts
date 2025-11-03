import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [RouterLink,RouterModule],
  templateUrl: './report.html',
  styleUrl: './report.css',
})
export class Report {

}
