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
    
    // Actions
    setUser: (userData: {
      email: string;
      firstName: string;
      lastName: string;
      profiles: UserProfile[];
      authorisations: UserAuthorisation[];
    }) => void;
    clearUser: () => void;
    updateUserProfile: (profile: UserProfile) => void;
    updateAuthorisations: (authorisations: UserAuthorisation[]) => void;
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