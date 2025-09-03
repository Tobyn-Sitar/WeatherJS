'use client'

import { useState, useEffect, useCallback } from "react"
import CityInfo from "@/app/components/weather/CityInfo"
import DailyForecast from "@/app/components/weather/DailyForecast"
import HourlyForecast from "@/app/components/weather/HourlyForecast"
import SearchInput from "@/app/components/weather/SearchInput"
import { getCurrentWeather, getForecast, getByCoords } from "@/app/lib/api"
import type { WeatherData, ForecastData, ForecastDay, HourlyData } from "@/app/types/weather"


function localDateKey(unix: number, tzOffsetSeconds: number): string {
  const localMs = (unix + tzOffsetSeconds) * 1000;
  return new Date(localMs).toISOString().slice(0, 10);
}

export default function HomePage() {
  const [current, setCurrent] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null)
  const [hourlyDay, setHourlyDay] = useState<ForecastDay | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function loadByCity(city: string) {
    const [c, f] = await Promise.all([getCurrentWeather(city), getForecast(city)])
    setCurrent(c)
    setForecast(f)
    setSelectedDay(null)
    
    // Find today's date or the first day on/after today
    const tz = (f as any)?.city?.timezone ?? 0
    const todayKey = localDateKey(Math.floor(Date.now() / 1000), tz)
    let todayDay =
      f?.days?.find((d: { date: string }) => d.date === todayKey) ||
      f?.days?.find((d: { date: string }) => d.date >= todayKey) ||
      f?.days?.[f?.days?.length - 1] ||
      null
    setHourlyDay(todayDay)
    localStorage.setItem("lastCity", city)
  }

  const handleSearch = useCallback(async (input: string) => {
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
        
        // Find today's date or the first day on/after today
        const tz = (f as any)?.city?.timezone ?? 0
        const todayKey = localDateKey(Math.floor(Date.now() / 1000), tz)
        let todayDay =
          f?.days?.find((d: { date: string }) => d.date === todayKey) ||
          f?.days?.find((d: { date: string }) => d.date >= todayKey) ||
          f?.days?.[f?.days?.length - 1] ||
          null
        setHourlyDay(todayDay)
        localStorage.setItem("lastCity", `${lat},${lon}`)
      } else {
        await loadByCity(input)
      }
    } catch (e) {
      setError((e as Error).message || "Could not load weather")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const last = localStorage.getItem("lastCity") || "Dunmore, US"
    handleSearch(last)
  }, [handleSearch])

  return (
    <div className="container mx-auto px-4 py-8" aria-busy={loading}>
      <section className="max-w-3xl mx-auto">
        <SearchInput onSearch={handleSearch} />
      </section>

      {error && <div className="mt-4 text-red-500">{error}</div>}
      {loading && <div className="mt-4 opacity-70">Loading weather…</div>}

      <section className="mt-8">
        <CityInfo data={current} selectedDay={hourlyDay} />
      </section>

      <section className="mt-8">
        <HourlyForecast day={hourlyDay} />
      </section>

      <section className="mt-10">
        <DailyForecast days={forecast?.days} onSelect={(day) => {
          const selectedDay = forecast?.days?.find(d => d.date === day.date) || day
          setSelectedDay(selectedDay)
          setHourlyDay(selectedDay)
        }} />
      </section>
    </div>
  )
}