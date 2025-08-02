"use server"

import { ICity, ICountry, IState, IStreet } from "@/types/locationType"
import axios from "axios"

export const locationConfigs= async () => {
    try {
        const [countryRes, stateRes, cityRes, streetRes] = await Promise.all([
            axios.get(process.env.COUNTRY_ENDPOINT!),
            axios.get(process.env.STATE_ENDPOINT!),
            axios.get(process.env.CITY_ENDPOINT!),
            axios.get(process.env.STREET_ENDPOINT!)
        ])

        const country = countryRes.data as ICountry[];
        const state = stateRes.data as IState[];
        const city = cityRes.data as ICity[];
        const street = streetRes.data as IStreet[];

        return {
            data: {
                country: country.sort((a, b) => a.name.localeCompare(b.name)),
                state: state.sort((a, b) => a.name.localeCompare(b.name)),
                city: city.sort((a, b) => a.name.localeCompare(b.name)),
                street: street.sort((a, b) => a.name.localeCompare(b.name))
            },
            error: null,
            code: "success",
        }

    } catch (error: any) {
        const isRedirect = error.digest?.startsWith('NEXT_REDIRECT');
        if (isRedirect) {
        return {
            data: null,
            error: 'Session expired',
            code: 'SESSION_EXPIRED',
        };
        }
        return {
        code: error.code ?? "unknown",
        error: error.response?.data?.message ?? "An unexpected error occurred",
        data: null
        }
    }
}