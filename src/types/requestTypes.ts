
/**
 * Optional query parameters for the GET /requests endpoint.
 */
export interface GetRequestsParams {
  orderBy?: string;
  term?: string;
  orderMode?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
  page?: number;
  type?: string;
}

export interface RequestData {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  NIU: string;
  joinDate: string;
  submittedDate: string;
  closedDate: string;
  status: string;
  documents: DocumentData[];
}

export interface DocumentData {
  id: string;
  name: string;
  type: string;
  status: string;
  date: string;
  contentUrl: string;
}

export interface VerifyRequestType {
  code: string;
  status: string;
  body: {
    notes: string;
  }
}

export interface ProfileApplication_T {
  idCardRecto: File;
  idCardVerso: File;
  selfie: File;
  description: string;
}

interface IApplicationRenter {
  Code: string;
  Status: string;
  RoleCode: string;
  CreatedAt: string; // Si tu veux gérer en Date => Date
  IsActive: number; // 0 ou 1
  UserCode: string;
  Email: string;
  Firstname: string;
  Gender: "MALE" | "FEMALE" | string; // On peut restreindre si on connaît toutes les valeurs
  Lastname: string;
  NIU: string;
  Phone: string;
  AvatarUrl: string;
}

export interface IApplication {
  Code: string;
  TypeCode: string;
  CreatedAt: string; // ou Date si tu souhaites convertir
  SubmittedDate: string;
  ClosedDate: string | null;
  IsClosed: number;
  StatusCode: string;
  Description: string;
  LevelCode: string;
  renter: IApplicationRenter;
}
