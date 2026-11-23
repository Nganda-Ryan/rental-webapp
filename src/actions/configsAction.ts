"use server"

import { ICity, ICountry, IState, IStreet, PricingResponse } from "@/types/configType"
import axios from "axios"

type LocationFetchResult<T> = {
    data: T[] | null
    error: string | null
    code: string
}

function sortByName<T extends { name: string }>(items: T[]): T[] {
    return [...items].sort((a, b) => a.name.localeCompare(b.name))
}

function toLocationError(error: unknown): LocationFetchResult<never> {
    const err = error as { digest?: string; code?: string; response?: { data?: { message?: string } } }
    if (err.digest?.startsWith('NEXT_REDIRECT')) {
        return {
            data: null,
            error: 'Session expired',
            code: 'SESSION_EXPIRED',
        }
    }
    return {
        code: err.code ?? "unknown",
        error: err.response?.data?.message ?? "An unexpected error occurred",
        data: null,
    }
}

async function fetchLocationList<T extends { name: string }>(
    endpoint: string | undefined,
): Promise<LocationFetchResult<T>> {
    if (!endpoint) {
        return { data: null, error: 'Location endpoint not configured', code: 'unknown' }
    }
    try {
        const response = await axios.get(endpoint)
        return {
            data: sortByName(response.data as T[]),
            error: null,
            code: "success",
        }
    } catch (error: unknown) {
        return toLocationError(error)
    }
}

export const fetchLocationCountries = () =>
    fetchLocationList<ICountry>(process.env.COUNTRY_ENDPOINT)

export const fetchLocationStates = () =>
    fetchLocationList<IState>(process.env.STATE_ENDPOINT)

export const fetchLocationCities = () =>
    fetchLocationList<ICity>(process.env.CITY_ENDPOINT)

export const fetchLocationStreets = () =>
    fetchLocationList<IStreet>(process.env.STREET_ENDPOINT)

export const locationConfigs = async () => {
    try {
        const [countryRes, stateRes, cityRes, streetRes] = await Promise.all([
            fetchLocationCountries(),
            fetchLocationStates(),
            fetchLocationCities(),
            fetchLocationStreets(),
        ])

        const firstError =
            countryRes.error && countryRes.code === 'SESSION_EXPIRED' ? countryRes :
            stateRes.error && stateRes.code === 'SESSION_EXPIRED' ? stateRes :
            cityRes.error && cityRes.code === 'SESSION_EXPIRED' ? cityRes :
            streetRes.error && streetRes.code === 'SESSION_EXPIRED' ? streetRes :
            null

        if (firstError) {
            return { data: null, error: firstError.error, code: firstError.code }
        }

        if (!countryRes.data || !stateRes.data || !cityRes.data || !streetRes.data) {
            const errorRes = countryRes.error ? countryRes :
                stateRes.error ? stateRes :
                cityRes.error ? cityRes : streetRes
            return {
                data: null,
                error: errorRes.error ?? "An unexpected error occurred",
                code: errorRes.code,
            }
        }

        return {
            data: {
                country: countryRes.data,
                state: stateRes.data,
                city: cityRes.data,
                street: streetRes.data,
            },
            error: null,
            code: "success",
        }
    } catch (error: unknown) {
        return toLocationError(error)
    }
}


export const pricingConfigs = async () => {
    try {
        const pricingConf = await axios.get(process.env.PRICING_ENDPOINT!)


        return {
            data: pricingConf.data as PricingResponse,
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