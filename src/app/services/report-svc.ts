import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginSvc } from './login-svc';
import { GenerateReportRequest, PagedResult, ReportDto } from '../models/Report';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportSvc {
  private baseUrl = 'https://localhost:7257/api/reports';

  constructor(private http: HttpClient, private auth: LoginSvc) {}

  generateReport(req: GenerateReportRequest): Observable<ReportDto> {
    const userId = this.auth.getUserIdFromToken();
    const role = this.auth.getRoleFromToken();
    let params = new HttpParams();
    if (userId) params = params.set('currentUserId', String(userId));
    if (role) params = params.set('currentUserRole', role);

    return this.http.post<ReportDto>(`${this.baseUrl}/generate`, req, { params });
  }

  getReportHistory(
    pageNumber = 1,
    pageSize = 10,
    searchTerm?: string,
    sortColumn?: string,
    sortOrder?: 'asc'|'desc'
  ): Observable<PagedResult<ReportDto>> {
    const userId = this.auth.getUserIdFromToken();
    if (!userId) throw new Error('Missing user id');

    let params = new HttpParams()
      .set('currentUserId', String(userId))
      .set('pageNumber', String(pageNumber))
      .set('pageSize', String(pageSize));

    if (searchTerm) params = params.set('searchTerm', searchTerm);
    if (sortColumn) params = params.set('sortColumn', sortColumn);
    if (sortOrder) params = params.set('sortOrder', sortOrder);

    return this.http.get<PagedResult<ReportDto>>(`${this.baseUrl}/history`, { params });
  }

  getReportMetadata(id: number): Observable<ReportDto> {
    return this.http.get<ReportDto>(`${this.baseUrl}/${id}`);
  }

  // Download file: either download the stored Cloudinary URL or proxy via your backend.
  // If file is accessible via URL, you can download that URL. We request blob to save locally.
  downloadFileUrl(fileUrl: string, suggestedFilename?: string): Observable<Blob> {
    // Note: if fileUrl is cross-origin and requires auth cookies or signed URL, adjust accordingly.
    return this.http.get(fileUrl, { responseType: 'blob' });
  }

  // Convenience: fetch metadata (if needed) then download
  downloadReportById(reportId: number): Observable<Blob> {
    return new Observable<Blob>((subscriber) => {
      this.getReportMetadata(reportId).subscribe({
        next: (meta) => {
          this.downloadFileUrl(meta.filePath).subscribe({
            next: (blob) => {
              subscriber.next(blob);
              subscriber.complete();
            },
            error: (err) => subscriber.error(err)
          });
        },
        error: (err) => subscriber.error(err)
      });
    });
  }
}
