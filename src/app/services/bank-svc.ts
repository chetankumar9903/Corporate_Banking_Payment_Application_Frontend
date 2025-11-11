import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bank, CreateBankDto, UpdateBankDto } from '../models/Bank';

@Injectable({
  providedIn: 'root',
})
export class BankSvc {
  private baseUrl = 'https://localhost:7257/api/Bank';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllBanks(
    searchTerm: string = '',
    sortColumn: string = '',
    sortOrder: 'asc' | 'desc' | '' = '',
    pageNumber: number = 1,
    pageSize: number = 5
  ): Observable<{ items: Bank[]; totalCount: number }> {
    const params = new URLSearchParams();

    if (searchTerm) params.append('searchTerm', searchTerm);
    if (sortColumn) params.append('sortColumn', sortColumn);
    if (sortOrder) params.append('sortOrder', sortOrder);
    params.append('pageNumber', pageNumber.toString());
    params.append('pageSize', pageSize.toString());

    return this.http.get<{ items: Bank[]; totalCount: number }>(
      `${this.baseUrl}?${params.toString()}`,
      this.getHeaders()
    );
  }

  getBankById(id: number): Observable<Bank> {
    return this.http.get<Bank>(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  createBank(dto: CreateBankDto): Observable<Bank> {
    return this.http.post<Bank>(this.baseUrl, dto, this.getHeaders());
  }

  updateBank(id: number, dto: UpdateBankDto): Observable<Bank> {
    return this.http.put<Bank>(`${this.baseUrl}/${id}`, dto, this.getHeaders());
  }

  deleteBank(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.getHeaders());
  }

  getBankUsers(): Observable<{ userId: number; userName: string }[]> {
    return this.http.get<{ userId: number; userName: string }[]>(
      'https://localhost:7257/api/User/bankusers',
      this.getHeaders()
    );
  }

  getBankByUsername(username: string): Observable<Bank> {
    return this.http.get<Bank>(
      `${this.baseUrl}/by-username/${username}`,
      this.getHeaders()
    );
  }
}
