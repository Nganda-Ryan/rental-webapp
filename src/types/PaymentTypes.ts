export interface IPlanSubscription {
    referenceCode : string,
    notes: string,
    userId: string,
    planCode: string,
    startDate : string,
    endDate : string,
    price : number,
    currency: string,
    method: string,
    phoneNumber: string,
    countryCode : string,
    phoneCode: string
}