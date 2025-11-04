import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Customer, CreateCustomerDto, Status } from '../models/Customer';
import { PagedResult } from '../models/PagedResult';

@Injectable({
  providedIn: 'root'
})
export class CustomerSvc {
  private baseUrl = 'https://localhost:7257/api/Customer';

  constructor(private http: HttpClient) { }

  getAllCustomers(
    page: number, 
    size: number, 
    sort: string, 
    order: 'ASC' | 'DESC', 
    searchTerm: string = ''
  ): Observable<PagedResult<Customer>> {
  
     let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
  
      .set('sortColumn', sort)
       .set('sortOrder', order) 
  
      .set('searchTerm', searchTerm);

    return this.http.get<PagedResult<Customer>>(this.baseUrl, { params });
  }

  createCustomer(dto: CreateCustomerDto): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, dto);
  }

  updateCustomerStatus(id: number, status: Status): Observable<Customer> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch<Customer>(
      `${this.baseUrl}/${id}/status`, 
      JSON.stringify(status),
      { headers: headers }
    );
  }
}