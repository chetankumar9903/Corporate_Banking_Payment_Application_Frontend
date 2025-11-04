import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePaymentDto, Payment, UpdatePaymentDto } from '../models/Payment';


@Injectable({
  providedIn: 'root'
})
export class PaymentSvc {
  private apiUrl = 'https://localhost:7257/api/Payment';

  constructor(private http: HttpClient) {}

  getByClientId(clientId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/client/${clientId}`);
  }

  create(dto: CreatePaymentDto): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, dto: UpdatePaymentDto): Observable<Payment> {

    return this.http.put<Payment>(`${this.apiUrl}/${id}`, dto);
  }
}
