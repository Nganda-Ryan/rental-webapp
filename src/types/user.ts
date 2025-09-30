export type CreateUserType = {
    "firstname": string;
    "lastname": string;
    "gender": string;
    "email": string;
    "userId": string;
    "phone": string;
    "password": string;
    "addressData": AddressDataType;
};


export interface ICreateUserParam {
    "email":string,
    "phone":string,
    "gender":string,
    "lastname":string,
    "firstname":string,
    "password": string,
    "role":string,
    "addressData": AddressDataType
}

export interface IUpdateUser {
  "userId": string,
  "lastname": string,
  "firstname": string,
  "phone": string,
  "avatarUrl": string,
}

export type AddressDataType = {
    "street": string;
    "city": string;
    "country": string;
}

// types/user.ts

export type UserAuthorisation = {
    resource: string;
    permissions: string[];
};
  
export type UserProfile = {
    id: string;
    name: string;
    role: string;
};
  
export interface UserState {
    // État utilisateur
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profiles: UserProfile[];
    authorisations: UserAuthorisation[];
    isAuthenticated: boolean;
}

export interface SeachUserParams {
  orderBy?: string;
  term?: string;
  orderMode?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
  page?: number;
  role?: string;
}

export type ManagerRole = "ADMIN" | "SUPPORT";
export type AllRole = "ALL" | "ADMIN" | "SUPPORT" | "LANDLORD" | "MANAGER" | "RENTER"

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  city: string;
  street: string;
  country: string;
  password: string;
  role: string;
};

export interface IUser {
  id: string;
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profile: string[];
  gender: string;
  city: string;
  street: string;
  name?: string;
  country: string;
  avatarUrl: string;
  status: string;
  NIU: string;
  permissions?: string []
  createdAt?: string;
}

export interface IUserPermission {
  "Code": string,
  "Title": string,
  "Description": string,
  "IsActive": number
}

export interface IInviteManagerRequest {
  "profilCode": string,
  "managerCode": string,
  "assetCode": string,
  "title":string,
  "body": {
    [key: string]: boolean;
  },
  "notes": string
}

export interface IProfileDetails {
  Code: string,
  Status: string,
  RoleCode: string,
  CreatedAt: string,
  IsActive: number,
  UserCode: string
}
export type UserStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ALL'




export interface IUserData {
  Code: string;
  AddressCode: string;
  Email: string;
  Firstname: string;
  Gender: "MALE" | "FEMALE" | string;
  Lastname: string;
  NIU: string;
  OtherEmail: string | null;
  OtherPhone: string | null;
  Phone: string;
  Status: string;
  AvatarUrl: string;
  Profiles: IUserProfile[];
  Address: IUserAddress;
  Subscriptions: ISubscription[];
}

export interface IUserProfile {
  Code: string;
  Status: string;
  RoleCode: "RENTER" | "LANDLORD" | string;
  CreatedAt: string; // format: "YYYY-MM-DD"
  IsActive: number;
  UserCode: string;
}

export interface IUserAddress {
  Code: string;
  City: string;
  Country: string;
  Street: string;
  Details: string | null;
}

export interface ISubscription {
  Code: string;
  Quantity: string;
  StartDate: string; // ISO date string
  EndDate: string; // ISO date string
  StatusCode: string;
  Notes: string;
  IsActive: number;
  UserCode: string;
  PlanCode: string;
  Consumptions: IConsumption[];
  Plan: IPlan;
}

export interface IConsumption {
  Code: string;
  Quantity: number;
  CreatedAt: string; // "YYYY-MM-DD HH:mm:ss"
  CompoCode: string;
  IsActive: number;
  Remaining: number;
  SubCode: string;
}

export interface IPlan {
  Code: string;
  Title: string;
  Price: number;
  Currency: string;
  CreatedAt: string; // "YYYY-MM-DD HH:mm:ss"
  Description: string;
  IsActive: number;
}


export interface ISetSecurityQuestion {
  "questionCode": string,
  "questionLabel": string,
  "responseData" : string
}

export interface IGetSecurityQuestion {
  "Id": number,
  "UserCode": string,
  "QuestionCode": string,
  "QuestionLabel": string,
  "ResponseData": string,
  "CreatedAt": string
}




// -- ME --//
export interface IMe {
  Code: string;
  AddressCode: string;
  Email: string;
  Firstname: string;
  Gender: "MALE" | "FEMALE" | string;
  Lastname: string;
  NIU: string;
  OtherEmail: string | null;
  OtherPhone: string | null;
  Phone: string;
  Status: "ACTIVE" | "INACTIVE" | string;
  AvatarUrl: string;
  Profiles: IProfile[];
  Address: IAddress;
  Subscriptions: ISubscription[];
  Consumptions: IConsumption[];
}

export interface IProfile {
  Code: string;
  Status: "ACTIVE" | "INACTIVE" | string;
  RoleCode: string;
  CreatedAt: string;
  IsActive: number;
  UserCode: string;
}

export interface IAddress {
  Code: string;
  City: string;
  Country: string;
  Street: string;
  Details: string | null;
}

export interface ISubscription {
  Code: string;
  Quantity: string;
  StartDate: string;
  EndDate: string;
  StatusCode: string;
  Notes: string;
  IsActive: number;
  UserCode: string;
  PlanCode: string;
  Consumptions: IConsumption[]; // vide dans ton JSON, donc any[] pour l'instant
  Plan: IPlan;
}

export interface IPlan {
  Code: string;
  Title: string;
  Price: number;
  Currency: string;
  CreatedAt: string;
  Description: string;
  IsActive: number;
}

export interface IConsumption {
  Code: string;
  Quantity: number;
  CreatedAt: string;
  ItemCode: string;
  IsActive: number;
  Remaining: number;
  UserCode: string;
  item: IConsumptionItem;
}

export interface IConsumptionItem {
  Code: string;
  Title: string;
  IsMesurable: number;
  Description: string;
  IsActive: number;
}


export interface IGetTenant {
  Code: string;
  UserCode: string;
  RoleCode: string;
  IsActive: number;
  Status: string;
  CreatedAt: string;
  user: {
    Code: string;
    AddressCode: string;
    Email: string;
    Firstname: string;
    Gender: 'MALE' | 'FEMALE' | string;
    Lastname: string;
    NIU: string;
    OtherEmail: string | null;
    OtherPhone: string | null;
    Phone: string;
    Status: string;
    AvatarUrl: string;
    Profiles: any[]; // à remplacer par un type spécifique si disponible
    Address: {
      Code: string;
      City: string;
      Country: string;
      Street: string;
    };
  };
}
