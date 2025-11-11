import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/PagedResult';
import { CreatePaymentDto, Payment, UpdatePaymentDto } from '../models/Payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentSvc {
  private baseUrl = 'https://localhost:7257/api/Payment';

  constructor(private http: HttpClient) { }

  getAllPayments(
    page: number, 
    size: number, 
    sort: string, 
    order: 'ASC' | 'DESC', 
    searchTerm: string = ''
  ): Observable<PagedResult<Payment>> {
     let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('sortColumn', sort)
      .set('sortOrder', order)
      .set('searchTerm', searchTerm);

    return this.http.get<PagedResult<Payment>>(this.baseUrl, { params });
  }

  updatePayment(id: number, dto: UpdatePaymentDto): Observable<Payment> {
    return this.http.put<Payment>(`${this.baseUrl}/${id}`, dto);
  }


  getById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}`);
  }


  getByClientId(clientId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/client/${clientId}`);
  }

  create(dto: CreatePaymentDto): Observable<Payment> {
    return this.http.post<Payment>(this.baseUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}