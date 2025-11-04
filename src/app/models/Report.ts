import { Status } from './Customer'; // Re-use the Status enum

// Based on your C# ReportType enum
export enum ReportType {
  TRANSACTION = 'TRANSACTION',
  PAYMENT = 'PAYMENT',
  SALARY = 'SALARY'
}

// Based on your C# ReportOutputFormat enum
export enum ReportOutputFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL'
}

// Based on your C# GenerateReportRequestDto
export interface GenerateReportRequestDto {
  reportName: string;
  reportType: ReportType;
  outputFormat: ReportOutputFormat;
  clientId?: number | null; // Use null for "All Clients"
  paymentStatusFilter?: Status | null; // Use null for "All Statuses"
  startDate?: string; // Format: "YYYY-MM-DD"
  endDate?: string;
}

// Based on your C# ReportDto
export interface GenerateReportRequest {
  reportName: string;
  reportType: ReportType;
  outputFormat: ReportOutputFormat;
  clientId?: number | null;
  paymentStatusFilter?: string | null;
  startDate?: string | null; // ISO
  endDate?: string | null;
}

export interface ReportDto {
  reportId: number;
  reportName: string;
  reportType: ReportType;
  outputFormat: ReportOutputFormat;
  generatedBy: number;
  generatedDate: string; // ISO 8601 date string
  filePath: string; // This is the public Cloudinary URL

}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}
