import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/PagedResult';
import { ReportDto, GenerateReportRequestDto } from '../models/Report';
import { UserRole } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ReportSvc {
  private baseUrl = 'https://localhost:7257/api/reports';

  constructor(private http: HttpClient) { }

  /**
   * Fetches the user's paged report history.
   * Your backend needs the currentUserId as a query param.
   */
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

  /**
   * Requests a new report to be generated.
   * Your backend needs currentUserId and currentUserRole as query params.
   */
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
}