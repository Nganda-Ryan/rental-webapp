import { useMemo } from 'react';
import { useConfigStore } from '@/lib/store/configStore';

function matchId(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  return String(a) === String(b);
}

export function useLocationFilters(
  selectedCountry: string,
  selectedState: string,
  selectedCity: string,
) {
  const country = useConfigStore((s) => s.country);
  const state = useConfigStore((s) => s.state);
  const city = useConfigStore((s) => s.city);
  const street = useConfigStore((s) => s.street);
  const isLocationLoading = useConfigStore((s) => s.isLocationLoading);

  const countryId = useMemo(
    () => country.find((c) => c.sortname === selectedCountry)?.id,
  // eslint-disable-next-line react-hooks/exhaustive-deps -- selectedCountry drives lookup
    [country, selectedCountry],
  );

  const filteredStates = useMemo(
    () =>
      countryId
        ? state.filter((s) => matchId(s.country_id, countryId))
        : [],
    [state, countryId],
  );

  const filteredCities = useMemo(
    () =>
      selectedState
        ? city.filter((c) => matchId(c.state_id, selectedState))
        : [],
    [city, selectedState],
  );

  const filteredStreets = useMemo(
    () =>
      selectedCity
        ? street.filter((s) => matchId(s.city_id, selectedCity))
        : [],
    [street, selectedCity],
  );

  return {
    filteredStates,
    filteredCities,
    filteredStreets,
    isCountriesLoading: isLocationLoading && country.length === 0,
    isStatesLoading:
      Boolean(selectedCountry) &&
      isLocationLoading &&
      state.length === 0,
    isCitiesLoading:
      Boolean(selectedState) &&
      isLocationLoading &&
      city.length === 0,
    isStreetsLoading:
      Boolean(selectedCity) &&
      isLocationLoading &&
      street.length === 0,
  };
}