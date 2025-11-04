// Based on your backend DocumentDto
export interface DocumentDto {
  documentId: number;
  documentName: string;
  documentType: string;
  cloudinaryPublicId: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: string; // ISO 8601 date string
  customerId: number;
  isActive: boolean;
}