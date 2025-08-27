import React, { useState } from "react"
import CityInfo from "@/components/CityInfo"
import DailyForecast from "@/components/DailyForecast"
import HourlyForecast from "@/components/HourlyForecast"
import SearchInput from "@/components/SearchInput"
import { getCurrentWeather, getForecast, getByCoords } from "@/lib/weather-api"

export default function HomePage() {
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function loadByCity(city) {
    const [c, f] = await Promise.all([getCurrentWeather(city), getForecast(city)])
    setCurrent(c)
    setForecast(f)
    setSelectedDay(null)
    localStorage.setItem("lastCity", city)
  }

  async function handleSearch(input) {
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
      setError(e.message || "Could not load weather")
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
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