import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/PagedResult';
import { Payment, UpdatePaymentDto } from '../models/Payment';
import { Status } from '../models/Customer';
// We don't need 'map'
// import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class PaymentSvc {
  private baseUrl = 'https://localhost:7257/api/Payment';

  constructor(private http: HttpClient) { }

  /**
   * Gets a paged list of payments from the backend.
   */
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

    // Remove the .pipe(map(...)) block, it was incorrect
    return this.http.get<PagedResult<Payment>>(this.baseUrl, { params });
  }

  /**
   * --- THIS IS THE FIX ---
   * Updates a payment by sending the DTO to the PUT endpoint.
   */
  updatePayment(id: number, dto: UpdatePaymentDto): Observable<Payment> {
    // This calls the [HttpPut("{id}")] endpoint on your PaymentController
    // which matches your C# PaymentService.UpdatePayment method.
    return this.http.put<Payment>(`${this.baseUrl}/${id}`, dto);
  }
}