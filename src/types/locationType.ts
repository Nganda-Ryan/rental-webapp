export interface ICountry { 
    "id": string,
    "sortname": string,
    "name": string,
    "phonecode": string
}
export interface IState {
	"id": string,
	"name": string,
	"country_id": string 
}

export interface ICity {
	"id": string,
	"name": string,
	"state_id": string
}

export interface IStreet { 
    "id": string, 
    "name": string, 
    "city_id": string 
}

export interface IConfig {
    country: ICountry[];
    state: IState[];
    city: ICity[];
    street: IStreet[];
}