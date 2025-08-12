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



export interface PricingResponse {
  default_currency: string;
  default_currency_symbol: string;
  plans: Plan[];
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  is_recommended: boolean;
  is_custom: boolean;
  pricing: Pricing[];
  features: Feature[];
  cta: Cta;
}

export interface Pricing {
  price_id: string;
  amount: number;
  price_term: string; // "monthly", etc.
  term_count: number;
  saving?: string; // optionnel car parfois absent
}

export interface Feature {
  id: string;
  text: string;
  included: boolean;
  max?: number | null; // optionnel et parfois null
  details?: string;    // présent uniquement pour certains features
}

export interface Cta {
  id: string;
  text: string;
  link: string;
}
