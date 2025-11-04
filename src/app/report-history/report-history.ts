import { Component } from '@angular/core';
import { ReportSvc } from '../services/report-svc';
import { ReportDto } from '../models/Report';
import { saveBlob } from '../utils/download';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-history',
  imports: [CommonModule,FormsModule],
  templateUrl: './report-history.html',
  styleUrl: './report-history.css',
})
export class ReportHistory {
 reports: ReportDto[] = [];
  loading = false;
  page = 1;
  pageSize = 10;
  total = 0;
  search = '';

  constructor(private svc: ReportSvc) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.getReportHistory(this.page, this.pageSize, this.search).subscribe({
      next: (res) => {
        this.reports = res.items;
        this.total = res.totalCount;
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  download(report: ReportDto) {
    // suggested filename from metadata
    const filename = `${report.reportName || 'report'}_${new Date(report.generatedDate).toISOString().slice(0,19).replace(/:/g,'-')}.${report.outputFormat === 'PDF' ? 'pdf' : 'xlsx'}`;
    this.svc.downloadFileUrl(report.filePath).subscribe({
      next: (blob) => saveBlob(blob, filename),
      error: (err) => console.error('Download failed', err)
    });
  }
clearFilter() {
  this.search = '';
  this.page = 1;        // reset to first page
  this.onSearch();      // reload all reports
}
  prev() { if (this.page>1) { this.page--; this.load(); } }
  next() { if (this.page * this.pageSize < this.total) { this.page++; this.load(); } }
  onSearch() { this.page = 1; this.load(); }
}
