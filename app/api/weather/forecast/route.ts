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
      url = `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    } else if (city) {
      url = `${BASE_URL}/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
    } else {
      return NextResponse.json({ error: 'City name or coordinates required' }, { status: 400 })
    }

    const response = await fetch(url)
    
    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limit reached. Try again soon.' }, { status: 429 })
      }
      return NextResponse.json({ error: 'Failed to fetch forecast' }, { status: response.status })
    }

    const data = await response.json()
    const tz = data.city?.timezone ?? 0
    const normalizedData = normalizeForecastList(data.list, tz)
    
    return NextResponse.json(normalizedData)
  } catch (error) {
    console.error('Forecast API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function dateKeyFrom(dtSeconds: number, tzOffsetSeconds: number): string {
  const ms = (dtSeconds + tzOffsetSeconds) * 1000
  const d = new Date(ms)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function hourLabelFrom(dtSeconds: number, tzOffsetSeconds: number): string {
  const ms = (dtSeconds + tzOffsetSeconds) * 1000
  const d = new Date(ms)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' })
}

function normalizeForecastList(list: any[], tzOffsetSeconds: number = 0) {
  const toIconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@2x.png`
  const byDate: Record<string, any[]> = {}
  
  for (const item of list) {
    const key = dateKeyFrom(item.dt, tzOffsetSeconds)
    if (!byDate[key]) byDate[key] = []
    byDate[key].push(item)
  }

  const days = Object.keys(byDate).slice(0, 5).map(date => {
    const entries = byDate[date]
    const noonish = entries.find(e => {
      const ms = (e.dt + tzOffsetSeconds) * 1000
      const h = new Date(ms).getUTCHours()
      return h >= 11 && h <= 14
    }) || entries[0]

    const temps = entries.map(e => e.main.temp)

    return {
      date,
      dayOfWeek: new Date((entries[0].dt + tzOffsetSeconds) * 1000)
        .toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
      icon: toIconUrl(noonish.weather[0].icon),
      description: noonish.weather[0].description,
      minF: Math.round(Math.min(...temps)),
      maxF: Math.round(Math.max(...temps)),
      hourlyData: entries.map(e => ({
        dt: e.dt,
        time: hourLabelFrom(e.dt, tzOffsetSeconds),
        tempF: Math.round(e.main.temp),
        windMph: Math.round(e.wind?.speed || 0),
        humidity: e.main.humidity,
        description: e.weather?.[0]?.description || '',
        icon: toIconUrl(e.weather?.[0]?.icon || '01d'),
      })),
    }
  })

  return { days }
}