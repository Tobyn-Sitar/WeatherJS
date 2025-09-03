// Client-side API functions that call the Next.js API routes

export async function getCurrentWeather(city: string) {
  const response = await fetch(`/api/weather/current?city=${encodeURIComponent(city)}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch weather')
  }
  return response.json()
}

export async function getForecast(city: string) {
  const response = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch forecast')
  }
  return response.json()
}

export async function getByCoords(lat: number, lon: number) {
  const response = await fetch(`/api/weather/coords?lat=${lat}&lon=${lon}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch weather by coordinates')
  }
  return response.json()
}

export async function searchCities(query: string, limit = 5) {
  if (!query) return []
  const response = await fetch(`/api/weather/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  if (!response.ok) return []
  return response.json()
}