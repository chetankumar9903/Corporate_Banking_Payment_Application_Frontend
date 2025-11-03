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

  // getAllBanks(): Observable<Bank[]> {
  //   return this.http.get<Bank[]>(this.baseUrl, this.getHeaders());
  // }

  getAllBanks(): Observable<{ items: Bank[]; totalCount: number }> {
  return this.http.get<{ items: Bank[]; totalCount: number }>(this.baseUrl);
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

  // ✅ Fetch all BANKUSERs from backend
  getBankUsers(): Observable<{ userId: number; userName: string }[]> {
    return this.http.get<{ userId: number; userName: string }[]>(
      'https://localhost:7257/api/User/bankusers',
      this.getHeaders()
    );
  }
}
