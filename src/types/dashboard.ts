export interface IPropertyStatus {
  StatusCode: 'RENTED' | 'DRAFT' | string;
  Total: number;
}

export interface IRentPaymentStatus {
  IsPaid: 0 | 1;
  Currency: string;
  Amount: number;
}

export interface IApplication {
  Code: string;
  TypeCode: string;
  CreatedAt: string;
  SubmittedDate: string;
  ClosedDate: string | null;
  IsClosed: 0 | 1;
  StatusCode: string;
  Description: string;
  LevelCode: string;
  renter: IApplicationRenter;
}

export interface IApplicationRenter {
  Code: string;
  Status: string;
  RoleCode: string;
  CreatedAt: string;
  IsActive: number;
  UserCode: string;
  Email: string;
  Firstname: string;
  Gender: 'MALE' | 'FEMALE' | string;
  Lastname: string;
  NIU: string;
  Phone: string;
  AvatarUrl: string;
}

export interface ICounts {
  properties: number;
  pendingInvoices: number;
  pendingRequests: number;
}

export interface IPendingRequest {
  TypeCode: string;
  StatusCode: string;
  Total: number;
}


export interface IDashboardResponse {
  PropertiesByStatus: IPropertyStatus[];
  RentPaymentsStatus: IRentPaymentStatus[];
  allApplications: IApplication[];
  AllPendingRequests: IPendingRequest[];
  Counts: ICounts;
}
