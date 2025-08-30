'use client'

import { useState, useEffect } from "react"
import CityInfo from "@/components/CityInfo"
import DailyForecast from "@/components/DailyForecast"
import HourlyForecast from "@/components/HourlyForecast"
import SearchInput from "@/components/SearchInput"
import { getCurrentWeather, getForecast, getByCoords } from "@/lib/api"

interface WeatherData {
  city: string
  country: string
  coord: { lat: number; lon: number }
  tempF: number
  tempC: number
  feelsLikeF: number
  humidity: number
  windMph: number
  description: string
  icon: string
  dt: number
}

interface ForecastDay {
  date: string
  dayOfWeek: string
  icon: string
  description: string
  minF: number
  maxF: number
  hourlyData: HourlyData[]
}

interface HourlyData {
  dt: number
  time: string
  tempF: number
  windMph: number
  humidity: number
  description: string
  icon: string
}

interface ForecastData {
  days: ForecastDay[]
}

export default function HomePage() {
  const [current, setCurrent] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function loadByCity(city: string) {
    const [c, f] = await Promise.all([getCurrentWeather(city), getForecast(city)])
    setCurrent(c)
    setForecast(f)
    setSelectedDay(null)
    localStorage.setItem("lastCity", city)
  }

  async function handleSearch(input: string) {
    try {
      setLoading(true)
      setError("")
      // support "lat,lon" from the geolocation button
      const m = input.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/)
      if (m) {
        const lat = parseFloat(m[1])
        const lon = parseFloat(m[2])
        const { current: c, forecast: f } = await getByCoords(lat, lon)
        setCurrent(c)
        setForecast(f)
        setSelectedDay(null)
        localStorage.setItem("lastCity", `${lat},${lon}`)
      } else {
        await loadByCity(input)
      }
    } catch (e) {
      setError((e as Error).message || "Could not load weather")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const last = localStorage.getItem("lastCity") || "Dunmore, US"
    handleSearch(last)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8" aria-busy={loading}>
      <section className="max-w-3xl mx-auto">
        <SearchInput onSearch={handleSearch} />
      </section>

      {error && <div className="mt-4 text-red-500">{error}</div>}
      {loading && <div className="mt-4 opacity-70">Loading weather…</div>}

      <section className="mt-8">
        <CityInfo data={current} />
      </section>

      <section className="mt-10">
        <DailyForecast days={forecast?.days} onSelect={setSelectedDay} />
      </section>

      <HourlyForecast
        day={selectedDay}
        onOpenChange={(open) => {
          if (!open) setSelectedDay(null)
        }}
      />
    </div>
  )
}