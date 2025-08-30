import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    let url: string
    if (lat && lon) {
      url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    } else if (city) {
      url = `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
    } else {
      return NextResponse.json({ error: 'City name or coordinates required' }, { status: 400 })
    }

    const response = await fetch(url)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 })
      }
      if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit reached. Try again soon.' }, { status: 429 })
      }
      return NextResponse.json({ error: 'Failed to fetch current weather' }, { status: response.status })
    }

    const data = await response.json()
    const normalizedData = normalizeCurrentWeather(data)
    
    return NextResponse.json(normalizedData)
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function normalizeCurrentWeather(data: any) {
  const toIconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`
  
  return {
    city: data.name,
    country: data.sys?.country || '',
    coord: data.coord,
    tempF: Math.round(data.main.temp),
    tempC: Math.round((data.main.temp - 32) * 5 / 9),
    feelsLikeF: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windMph: Math.round(data.wind?.speed || 0),
    description: data.weather?.[0]?.description || '',
    icon: toIconUrl(data.weather?.[0]?.icon || '01d'),
    dt: data.dt
  }
}