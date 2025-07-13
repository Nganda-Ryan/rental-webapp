export type SignInSuccess = {
    user: {
      uid: string;
      accessToken: string;
      email: string | null;
      refreshToken: string;
    };
    error: null;
    code: null;
};
  
export type SignInError = {
    user: null;
    error: string;
    code: string;
};
  
export type SignInResult = SignInSuccess | SignInError;

export type SignUpResult = {
  user: any;
  error: string | null | any;
  code: string | null;
  redirectTo: string | null;
};

export type Profile = {
  Code: string;
  UserCode: string;
  RoleCode: string;
  IsActive: number;
  Status: string;
  CreatedAt: string;
}

type Address = {
  Code: string;
  City: string;
  Country: string;
  Street: string;
}

export type SessionPayload = {
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
  userId: string;
  IsVerified: number;
  expiresAt: Date
  Profiles: Profile[];
  Address: Address;
  Subscriptions: any[]; 
  accessToken: string;
  refreshToken: string;
  roles: string[];
  activeRole: string;
}


export type ProfileDetail = {
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
  userId: string;
  IsVerified: number;
  expiresAt: Date
  Profiles: Profile[];
  Address: Address;
  Subscriptions: any[];
  roles: string[];
  activeRole: string;
}
  