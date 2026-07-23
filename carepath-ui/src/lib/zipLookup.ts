export type ZipLookupResult = {
  city: string
  county: string
  state: string
  stateAbbreviation: string
}

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? 'http://localhost:3000/api'

export async function lookupZipCode(zipCode: string): Promise<ZipLookupResult | null> {
  const zip = zipCode.trim().slice(0, 5)
  if (!/^\d{5}$/.test(zip)) return null

  try {
    const response = await fetch(`${DEFAULT_API_BASE}/zip-lookup/${encodeURIComponent(zip)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return null
    }

    const data: ZipLookupResult = await response.json()
    return data
  } catch {
    return null
  }
}
