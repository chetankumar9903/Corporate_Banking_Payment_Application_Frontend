export interface Bank {
  bankId: number;
  bankName: string;
  branch: string;
  ifscCode: string;
  contactNumber: string;
  emailId: string;
  isActive: boolean;
  userId: number;
}

export interface CreateBankDto {
  bankName: string;
  branch: string;
  ifscCode: string;
  contactNumber: string;
  emailId: string;
  userId: number;
}

export interface UpdateBankDto {
  bankName?: string;
  branch?: string;
  ifscCode?: string;
  contactNumber?: string;
  emailId?: string;
  isActive?: boolean;
}
