export enum ReportType {
  TRANSACTION = 'TRANSACTION',
  PAYMENT = 'PAYMENT',
  SALARY = 'SALARY'
}

export enum ReportOutputFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL'
}

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
  generatedDate: string;
  filePath: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}
