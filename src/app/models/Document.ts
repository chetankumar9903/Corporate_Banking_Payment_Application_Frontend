
export interface DocumentDto {
  documentId: number;
  documentName: string;
  documentType: string;
  cloudinaryPublicId: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
  customerId: number;
  isActive: boolean;
}