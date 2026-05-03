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
  unreadMessages?: number;
}

export interface IPendingRequest {
  TypeCode: string;
  StatusCode: string;
  Total: number;
}

export interface ICurrentLoan {
  Code: string;
  AssetCode: string;
  Title: string;
  Amount: number;
  StartDate: string;
  EndDate: string;
  Currency: string;
  AssetTypeCode: string;
  CoverUrl: string;
}

export interface IInvoiceStatus {
  StatusCode: string;
  Total: number;
}

export interface IMonthlyFinanceByAsset {
  AssetCode: string;
  AssetTitle: string;
  AssetCurrency: string;
  Month: string;
  ItemCode: string;
  Currency: string;
  Count: number;
  Total: number;
  PaidTotal: number;
  UnpaidTotal: number;
}

export interface IArrearsByAsset {
  AssetCode: string;
  AssetTitle: string;
  Currency: string;
  Total: number;
  PaidTotal: number;
  UnpaidTotal: number;
}

export interface IDashboardResponse {
  PropertiesByStatus: IPropertyStatus[];
  RentPaymentsStatus: IRentPaymentStatus[];
  allApplications: IApplication[];
  AllPendingRequests: IPendingRequest[];
  Counts: ICounts;
  CurrentLoans?: ICurrentLoan[];
  InvoicesByStatus?: IInvoiceStatus[];
  UnpaidInvoices?: IRentPaymentStatus[];
  MonthlyFinanceByAsset?: IMonthlyFinanceByAsset[];
  ArrearsByAsset?: IArrearsByAsset[];
  TotalFinance?: number;
  TotalArrears?: number;
}

export interface ISupportDashboardCardValue {
  value: number;
  changePctThisMonth?: number;
}

export interface ISupportDashboardCards {
  activeUsers: ISupportDashboardCardValue;
  propertiesListed: ISupportDashboardCardValue;
  pendingVerifications: { value: number };
  monthlyActivity: { valuePct: number; changePctThisMonth?: number };
}

export interface ISupportUserGrowthPoint {
  month: string;
  value: number;
}

export type SupportUserDistributionRole = 'RENTER' | 'LANDLORD' | 'MANAGER' | 'SUPPORT';

export interface ISupportUserDistributionItem {
  label: string;
  role: SupportUserDistributionRole | string;
  percent: number;
  count: number;
}

export type SupportRecentActivityUnit = 'days' | 'hours' | 'minutes' | string;

export interface ISupportRecentActivityItem {
  title: string;
  ago: string;
  unit: SupportRecentActivityUnit;
}

export interface ISupportVerificationStatus {
  lessorVerificationsPct: number;
  propertyVerificationsPct: number;
  supportResponseRatePct: number;
}

export interface ISupportDashboardResponse {
  cards: ISupportDashboardCards;
  userGrowth: ISupportUserGrowthPoint[];
  userDistribution: ISupportUserDistributionItem[];
  recentActivity: ISupportRecentActivityItem[];
  verificationStatus: ISupportVerificationStatus;
}
