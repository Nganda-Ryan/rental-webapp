import { AddressDataType } from "./user";

export type PropertyStatus = 'available' | 'occupied' | 'maintenance';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency?: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  status: PropertyStatus;
}

export interface SubProperty {
  "typeCode": string,
  "title": string,
  "notes": string,
  "price": number,
  "currency": string,
  "coverUrl": string,
  "tag": string[],
  "description": string [],
}

export interface SubProperty2 {
  "typeCode": string,
  "title": string,
  "notes": string,
  "price": number,
  "currency": string,
  "coverUrl": string,
  "tag": string,
  "description": string [],
}


export interface PropertyCardProps {
  property: AssetData;
  onClick?: (id: string) => void;
  className?: string;
}

export  interface CreatePropertyType {
  "typeCode": string,
  "title": string,
  "notes": string,
  "price": number,
  "currency": string,
  "coverUrl": string,
  "tag": string [],
  "addressData": AddressDataType,
  "billingItems":string [],
  "items": SubProperty[]
}



export interface AssetFormValue {
  country: string;
  propertyName: string;
  propertyType: string;
  city: string;
  street: string;
  description: string;
  billingItem: any[]; // À remplacer par un type spécifique si connu
  rent: number;
  test: string;
  UnitsType: string;
  UnitsKey: string; // valeur fixe
  numberOfUnit: number;
  UnitsDefaultPrice: number;
  currency: string; // adapte selon les valeurs possibles
  price: number;
  cover: File;
  UnitList: SubProperty2[];
  tag: string;
}


export interface SeachPropertyParams {
  orderBy?: string;
  term?: string;
  orderMode?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
  page?: number;
  profileCode?: string;
}
export interface SeachInvoiceParams {
  "orderBy": string,
  "orderMode": "asc" | "desc",
  "statusCodes"?: string[], //not required
  "codes"?: string[],//not required
  "contractCodes"?: string[], //not required
  "assetCodes"?: string[], //not required
  "profileCode"?: string[],//not required
}

export type AssetData = {
  Code: string;
  Title: string
  Price: number;
  Currency: string;
  CoverUrl: string
  StatusCode: string;
  IsActive: number; // 1 ou 0
  TypeCode: string;
  IsVerified: number; // 1 ou 0
  Address: {
    Code: string;
    City: string;
    Country: string;
    Street: string;
  };
};

export type AssetDataDetailed = {
  Code: string;
  Title: string
  Price: number;
  Currency: string;
  Permission: string [];
  CoverUrl: string;
  StatusCode: string;
  IsActive: number; // 1 ou 0
  TypeCode: string;
  IsVerified: number; // 1 ou 0
  whoIs: string;
  BillingItems: string[]
  Units: AssetData []
  Address: {
    Code: string;
    City: string;
    Country: string;
    Street: string;
  };
};

export interface IPropertyVerificationDoc {
  "Title": string;
  "ContentUrl": File | string;
  "Type": "DEED_SALE" | "LAND_TITLE" | "BUILDING_PERMIT" | "DOCUMENT" | "BIRTH_CERTIFICATE" | "INHERITANCE_CERTIFICATE";
}
export interface IPropertyVerification {
  "userId": string;
  "assetCode": string;
  "title": string;
  "body": IPropertyVerificationDoc [];
  "notes": string;
}

export interface IPropertyVerificationForm {
    propertyDeed: null | File [] | undefined;
    buildindPermit: null | File [] | undefined;
    deedOfSales: null;
    bithCertificate: null | File [] | undefined;
    certificateOfInheritance: null | File [] | undefined;
    notes: string | undefined;
}

export interface IContract {
  "profilCode": string,
  "renterUserId": string,
  "assetCode": string,
  "initialDuration": number,
  "startDate": string,
  "endDate": string,
  "notes": "sample",
  "billingItems":string []
}

export interface IContractForm {
  "profilCode": string,
  "renterUserId": string,
  "assetCode": string,
  "initialDuration": number,
  "startDate": string,
  "endDate": string,
  "notes": string,
  "billingItems": string []
}

export interface IContractDetail {
  id: string;
  tenant: {
    name: string;
    email: string;
    phone: string;
    userCode: string;
  }
  startDate: string;
  endDate: string;
  monthlyRent: number;
  currency: string;
  status: string;
  notes: string;
  billingElements: Array<{
    code: string,
    label: string,
  }>
}


export interface IInvoiceForm {
  id: string;
  tableId: string;
  tenant: string,
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  notes: string;
  currency: string;
  billingElements: Array<{
    id: string,
    code: string,
    label: string,
    amount: number,
    paidDate: string,
    status: boolean,
  }>
}


export interface IInvoice {
  "profilCode": string,
  "userId": string,
  "contractCode": string,
  "startDate": string,
  "endDate": string,
  "notes": string,
  "items": Array<{
    "itemCode": string,
    "amount": string,
    "isPaid" : boolean,  
    "paidDate" : string,
    "notes": string
  }>
}

export interface IInvoiceTableData {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
}


export interface IUpdateInvoiceParam {
  "profilCode": string,
  "userId": string,
  "contractCode": string,
  "code": string,
  "notes": string,
  "items": Array<{
    "itemCode": string,
    "code": string,
    "isPaid": boolean,
    "paidDate": string
  }>
}