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

type Profile = {
  Code: string;
  UserCode: string;
  RoleCode: string;
  IsActive: number;
  Status: string;
  CreatedAt: string; // ISO date format, peut être typé plus strictement si besoin
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
  Gender: 'MALE' | 'FEMALE' | string; // tu peux restreindre davantage si tu connais toutes les valeurs possibles
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
  Subscriptions: any[]; // à adapter si tu connais la structure des abonnements
  accessToken: string;
  refreshToken: string;
  roles: string[];
  activeRole: string;
}

  