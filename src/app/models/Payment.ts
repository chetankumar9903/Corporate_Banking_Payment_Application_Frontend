import { Status } from './Customer';

export interface NestedClient {
  companyName: string;
}
export interface NestedBeneficiary {
  beneficiaryName: string;
  accountNumber: string;
}



export interface Payment {
  paymentId: number;
  clientId: number;
  beneficiaryId: number;
  beneficiaryName:string; 
  amount: number;
  requestDate: string;
  processedDate?: string;
  paymentStatus: Status;
  description?: string;
  rejectReason?: string;

  client?: NestedClient;
  beneficiary?: NestedBeneficiary;

}

export interface UpdatePaymentDto {
  paymentStatus: Status;
  rejectReason?: string;
}


export interface CreatePaymentDto {
  clientId: number;
  beneficiaryId: number;
  amount: number;
  description?: string;
}


