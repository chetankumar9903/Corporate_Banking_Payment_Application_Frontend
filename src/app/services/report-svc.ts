import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginSvc } from './login-svc';
import { PagedResult } from '../models/PagedResult';
import { ReportDto, GenerateReportRequestDto } from '../models/Report';
import { UserRole } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class ReportSvc {
  private baseUrl = 'https://localhost:7257/api/reports';

  constructor(private http: HttpClient, private auth: LoginSvc) {}


   generateReport(
    dto: GenerateReportRequestDto,
    userId: number,
    role: UserRole
  ): Observable<ReportDto> {
   
    let params = new HttpParams()
      .set('currentUserId', userId.toString())
      .set('currentUserRole', role);
 
    return this.http.post<ReportDto>(`${this.baseUrl}/generate`, dto, { params });
  }

  
  getReportHistory(
    userId: number,
    page: number,
    size: number,
    sort: string,
    order: 'ASC' | 'DESC',
    searchTerm: string = ''
  ): Observable<PagedResult<ReportDto>> {
   
    let params = new HttpParams()
      .set('currentUserId', userId.toString()) // <-- Required by your backend
      .set('pageNumber', page.toString())
      .set('pageSize', size.toString())
      .set('sortColumn', sort)
      .set('sortOrder', order)
      .set('searchTerm', searchTerm);
 
    return this.http.get<PagedResult<ReportDto>>(`${this.baseUrl}/history`, { params });
  }

 
  getReportMetadata(id: number): Observable<ReportDto> {
    return this.http.get<ReportDto>(`${this.baseUrl}/${id}`);
  }


  downloadFileUrl(fileUrl: string): Observable<Blob> {
    
    return this.http.get(fileUrl, { responseType: 'blob' });
  }

 
  downloadReportById(reportId: number): Observable<Blob> {
    return new Observable<Blob>((subscriber) => {
      this.getReportMetadata(reportId).subscribe({
        next: (meta) => {
          this.downloadFileUrl(meta.filePath).subscribe({
            next: (blob) => {
              subscriber.next(blob);
              subscriber.complete();
            },
            error: (err) => subscriber.error(err),
          });
        },
        error: (err) => subscriber.error(err),
      });
    });
  }
}
