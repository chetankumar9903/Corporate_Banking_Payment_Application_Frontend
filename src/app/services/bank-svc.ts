import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bank, CreateBankDto, UpdateBankDto } from '../models/Bank';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BankSvc {
  private baseUrl = 'https://localhost:7257/api/Bank';

  constructor(private http: HttpClient) { }

  getAllBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(this.baseUrl);
  }

  getBankById(id: number): Observable<Bank> {
    return this.http.get<Bank>(`${this.baseUrl}/${id}`);
  }

  createBank(dto: CreateBankDto): Observable<Bank> {
    return this.http.post<Bank>(this.baseUrl, dto);
  }

  updateBank(id: number, dto: UpdateBankDto): Observable<Bank> {
    return this.http.put<Bank>(`${this.baseUrl}/${id}`, dto);
  }

  deleteBank(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBankUsers() {
  return this.http.get<{ userId: number; userName: string }[]>('https://localhost:7257/api/User/bankusers');
}
}
