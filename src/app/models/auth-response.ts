export interface AuthResponseViewModel {
  token: string;
  userName: string;
  role: string;
  emailId: string;
  fullName: string;
  clientId?:string;
}