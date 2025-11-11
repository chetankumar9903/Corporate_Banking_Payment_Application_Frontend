import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Client, CreateClientDto } from '../models/Client';
import { PagedResult } from '../models/PagedResult';

@Injectable({
  providedIn: 'root'
})
export class ClientSvc {
  private baseUrl = 'https://localhost:7257/api/Client';

  constructor(private http: HttpClient) { }

  createClient(dto: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, dto);
  }


  getAllClients(
    page: number, 
    size: number, 
    sort: string, 
    order: 'ASC' | 'DESC', 
    searchTerm: string = ''
  ): Observable<PagedResult<Client>> {
     let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('sortColumn', sort)
      .set('sortOrder', order)
      .set('searchTerm', searchTerm); 

    return this.http.get<PagedResult<Client>>(this.baseUrl, { params }).pipe(
      map(result => {

        result.items.forEach(item => {
          item.balance = +item.balance;
        });
        return result;
      })
    );
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBalance(clientId: number): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.baseUrl}/${clientId}/balance`);
  }
  updateBalance(clientId: number, dto: { amount: number }) {
  return this.http.patch(`${this.baseUrl}/${clientId}/balance`,dto);
}
getClientProfile(clientId: number) {
  return this.http.get<ClientProfile>(`${this.baseUrl}/${clientId}`);
}

updateClient(clientId: number, dto: { companyName: string, isActive: boolean }) {
  return this.http.put(`${this.baseUrl}/${clientId}`, dto);
}


}