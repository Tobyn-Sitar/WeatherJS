const API_KEY = 'REDACTED'
const BASE_URL = 'https://api.openweathermap.org'

export async function fetchCityWeather(cityName) {
  try {
    const response = await fetch(
      `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=imperial`
    )
    if (!response.ok) {
      throw new Error('Weather data not found')
    }
    const data = await response.json()
    return {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

export async function fetch5DayForecast(cityName) {
  try {
    const response = await fetch(
      `${BASE_URL}/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=imperial`
    )
    if (!response.ok) {
      throw new Error('Forecast data not found')
    }
    const data = await response.json()
    return data.list
  } catch (error) {
    console.error('Error fetching forecast:', error)
    return []
  }
}

export async function searchCities(query) {
  try {
    if (query.length < 2) return []
    
    const response = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    )
    if (!response.ok) {
      throw new Error('Geocoding failed')
    }
    const data = await response.json()
    return data.map(city => ({
      name: city.name,
      country: city.country,
      state: city.state,
      displayName: `${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}`
    }))
  } catch (error) {
    console.error('Error searching cities:', error)
    return []
  }
}