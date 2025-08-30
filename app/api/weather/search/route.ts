import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const limit = searchParams.get('limit') || '5'

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  if (!query) {
    return NextResponse.json([])
  }

  try {
    const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      return NextResponse.json([])
    }

    const data = await response.json()
    const cities = data.map((c: any) => ({
      name: c.name,
      state: c.state || '',
      country: c.country || '',
      displayName: `${c.name}${c.state ? ', ' + c.state : ''}, ${c.country}`,
      lat: c.lat,
      lon: c.lon
    }))
    
    return NextResponse.json(cities)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json([])
  }
}