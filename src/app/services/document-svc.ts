import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentDto } from '../models/Document';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class DocumentSvc {
  private baseUrl = 'https://localhost:7257/api/Document';

  constructor(private http: HttpClient) { }

  uploadDocument(customerId: number, documentType: string, file: File): Observable<DocumentDto> {
    const formData = new FormData();
    formData.append('CustomerId', customerId.toString());
    formData.append('DocumentType', documentType);
    formData.append('File', file, file.name);
    return this.http.post<DocumentDto>(`${this.baseUrl}/upload`, formData);
  }

  getDocumentsByCustomer(customerId: number): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${documentId}`);
  }


  getFreshViewUrl(documentId: number): Observable<string> {

    return this.http.get<{ url: string }>(`${this.baseUrl}/view-url/${documentId}`).pipe(
      map(response => response.url)
    );
  }

}