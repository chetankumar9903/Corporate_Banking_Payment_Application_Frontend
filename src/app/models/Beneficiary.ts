export interface Beneficiary {
  beneficiaryId: number;
  beneficiaryName: string;
  accountNumber: string;
  bankName: string;
  branch?: string;
  ifscCode?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  isActive: boolean;
  clientId: number;
}

export interface CreateBeneficiaryDto {
  beneficiaryName: string;
  accountNumber: string;
  bankName: string;
  branch?: string;
  ifscCode?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  clientId: number;
}

export interface UpdateBeneficiaryDto {
  beneficiaryName?: string;
  bankName?: string;
  branch?: string;
  ifscCode?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  isActive?: boolean;
}
