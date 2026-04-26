interface IUser {
    Code: string;
    AddressCode: string;
    Email: string;
    Firstname: string;
    Gender: string;
    Lastname: string;
    NIU: string;
    OtherEmail: string | null;
    OtherPhone: string | null;
    Phone: string;
    Status: string;
    AvatarUrl: string;
    Profiles: any[];
}

interface ICreator {
    Code: string;
    Status: string;
    RoleCode: string;
    CreatedAt: string;
    IsActive: number;
    UserCode: string;
    user: IUser;
}

interface IAddress {
    Code: string;
    City: string;
    Country: string;
    Street: string;
}

interface IAssetType {
    Code: string;
    Type: string;
    IsActive: number;
    Title: string;
}

interface IOwner {
    Code: string;
    Status: string;
    RoleCode: string;
    CreatedAt: string;
    IsActive: number;
    UserCode: string;
    user: IUser;
}

interface IAsset {
    Code: string;
    Title: string;
    TypeCode: string;
    OwnerCode: string;
    Price: number;
    Currency: string;
    CoverUrl: string;
    Tag: string;
    Notes: string;
    StatusCode: string;
    IsActive: number;
    IsVerified: number;
    CreatedAt: string;
    EndDate: string;
    ParentCode: string | null;
    AddressCode: string;
    Address: IAddress;
    aType: IAssetType;
    owner: IOwner;
    assets: any[];
    managers: any[];
}

interface IContent {
    Code: string;
    TypeCode: string;
    IsActive: number;
    Title: string;
    ContentUrl: string;
    ParentCode: string;
    LevelCode: string;
    StatusCode: string;
}

export interface IGetRentalRequestDetail {
    reqData: {
        Code: string;
        TypeCode: string;
        Object: string;
        ParentCode: string;
        CreatorCode: string;
        HandlerCode: string | null;
        CreatedAt: string;
        SubmittedDate: string;
        StatusCode: string;
        Description: string;
        LevelCode: string;
        ClosedDate: string | null;
        ResponseData: string | null;
        RequestData: string;
        IsClosed: number;
        creator: ICreator;
    };
    contents: IContent[];
    asset: IAsset;
}

export interface IGetRentalScore {
    rawScore: number;
    score: number;
    scoreText: string;
    maxScore: number;
    scoreLevel: string;
    minScore: number;
    lowLimit: number;
    mediumLimit: number;
    
    checkCredit: {
        credit: number;
        isEnough: boolean;
    };
    
    calculate: {
        userCode: string;
        finalScore: string;
        breakdown: {
            paymentHistory: {
                points: number;
                details: string;
                pointsDetails: {
                    rentPoints: number;
                    utilityPoints: number;
                };
                results: {
                    ItemCode: string;
                    EndDate: string;
                    PaidDate: string;
                    DaysLate: number;
                }[];
            };
            
            lengthOfHistory: {
                points: number;
                details: string;
                profil: {
                    CreatedAt: string;
                    UserCode: string;
                    Code: string;
                };
            };
            
            rentalHistory: {
                points: number;
                details: string;
                counts: {
                    collectionCount: number;
                    chargedOffCount: number;
                };
                results: any[];
            };
        };
    };
    
    userData: {
        Code: string;
        AddressCode: string;
        Email: string;
        Firstname: string;
        Lastname: string;
        Gender: string;
        NIU: string;
        OtherEmail: string;
        OtherPhone: string;
        Phone: string;
        Status: string;
        AvatarUrl: string;
        IsVerified: number;
        ViewCount: number;
        ViewYear: string;
        
        Profiles: {
            Code: string;
            Status: string;
            RoleCode: string;
            CreatedAt: string;
            IsActive: number;
            UserCode: string;
        }[];
        
        Address: {
            Code: string;
            City: string;
            Country: string;
            Street: string;
            Details: string;
        };
    };
}

export interface SearchRequest {
    ApplyUser?:   boolean;
    limit?:       string;
    offset?:      string;
    orderBy?:     string;
    orderMode?:   string;
    page?:        string;
    parentCodes?: string;
    statusCodes?: string;
    term?:        string;
    type?:        string;
    [property: string]: any;
}

export interface IApproveApplicationRequest {
    "code": string, 
     "status": "APPROVED" | "DECLINED",
     "body": {
         "notes": string
     }
}