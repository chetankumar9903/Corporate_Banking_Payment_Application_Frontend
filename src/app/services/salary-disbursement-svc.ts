import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/PagedResult';
import { SalaryDisbursement } from '../models/SalaryDisbursement';

@Injectable({
  providedIn: 'root'
})
export class SalaryDisbursementSvc {
  private baseUrl = 'https://localhost:7257/api/SalaryDisbursement';

  constructor(private http: HttpClient) { }

 
  getAllSalaryDisbursements(
    page: number, 
    size: number, 
    sort: string, 
    order: 'ASC' | 'DESC', 
    searchTerm: string = ''
  ): Observable<PagedResult<SalaryDisbursement>> {
     let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('sortColumn', sort)
      .set('sortOrder', order)
      .set('searchTerm', searchTerm);

    return this.http.get<PagedResult<SalaryDisbursement>>(this.baseUrl, { params });
  }
}