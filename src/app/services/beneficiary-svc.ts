import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Beneficiary, CreateBeneficiaryDto, UpdateBeneficiaryDto } from '../models/Beneficiary';

@Injectable({
  providedIn: 'root',
})
export class BeneficiarySvc {
   private apiUrl = 'https://localhost:7257/api/Beneficiary';

  constructor(private http: HttpClient) {}

  getAll(searchTerm = '', sortColumn = '', sortOrder = 'asc', pageNumber = 1, pageSize = 10): Observable<any> {
    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('sortColumn', sortColumn)
      .set('sortOrder', sortOrder)
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getByClientId(clientId: number): Observable<Beneficiary[]> {
    return this.http.get<Beneficiary[]>(`${this.apiUrl}/client/${clientId}`);
  }

  getById(id: number): Observable<Beneficiary> {
    return this.http.get<Beneficiary>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateBeneficiaryDto): Observable<Beneficiary> {
    return this.http.post<Beneficiary>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateBeneficiaryDto): Observable<Beneficiary> {
    return this.http.put<Beneficiary>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
