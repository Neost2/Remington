import { logger } from '../config/logger';

type ZippopotamPlace = {
  'place name': string
  state: string
  'state abbreviation': string
  latitude: string
  longitude: string
}

type ZippopotamResponse = {
  places: ZippopotamPlace[]
}

type NominatimResponse = {
  address?: {
    county?: string
  }
}

function stripCountySuffix(county: string): string {
  return county.replace(/\s+County$/i, '').trim()
}

export async function lookupZipCodeFromServerside(zipCode: string): Promise<{ city: string; county: string; state: string; stateAbbreviation: string } | null> {
  const zip = zipCode.trim().slice(0, 5)
  if (!/^\d{5}$/.test(zip)) return null

  try {
    const zipRes = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      headers: { 'User-Agent': 'CarePath/1.0' },
    })
    if (!zipRes.ok) return null

    const zipData: ZippopotamResponse = await zipRes.json() as ZippopotamResponse
    const place = zipData.places?.[0]
    if (!place) return null

    const city = place['place name']
    const state = place.state
    const stateAbbreviation = place['state abbreviation']

    let county = ''
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${place.latitude}&lon=${place.longitude}&format=json&addressdetails=1&zoom=10`,
        { headers: { 'User-Agent': 'CarePath/1.0' } }
      )
      if (geoRes.ok) {
        const geoData: NominatimResponse = await geoRes.json() as NominatimResponse
        if (geoData.address?.county) {
          county = stripCountySuffix(geoData.address.county)
        }
      }
    } catch {
      logger.warn('County lookup failed for ZIP', { zip })
    }

    return { city, county, state, stateAbbreviation }
  } catch (err) {
    logger.error('ZIP lookup error', { zip, error: (err as Error).message })
    return null
  }
}
