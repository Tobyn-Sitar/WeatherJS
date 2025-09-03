import Image from 'next/image'

import type { WeatherData, ForecastDay } from "@/app/types/weather"

interface CityInfoProps {
  data: WeatherData | null
  selectedDay?: ForecastDay | null
}

const CityInfo = ({ data, selectedDay }: CityInfoProps) => {
  if (!data) return null
  const { city, country, tempF, feelsLikeF, description, icon, humidity, windMph } = data

  function prettyFromKey(dateKey: string) {
    const [y, m, d] = dateKey.split('-').map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d))
    return dt.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }

  const getDisplayDate = () => {
    if (selectedDay?.date) return prettyFromKey(selectedDay.date)
    const today = new Date()
    return today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mx-auto">{getDisplayDate()}</h2>
      <h3 className="mt-1 text-2xl font-bold">{city}{country ? `, ${country}` : ''}</h3>
      <div className="mt-3 flex items-center justify-center gap-4">
        <Image src={icon} alt={description} width={56} height={56} />
        <div>
          <div className="text-4xl font-bold">{tempF}°F</div>
          <div className="capitalize text-muted-foreground">{description}</div>
          <div className="text-sm mt-1">Feels like {feelsLikeF}°F</div>
          <div className="text-sm mt-1">Humidity {humidity}% • Wind {windMph} mph</div>
        </div>
      </div>
    </div>
  )
}

export default CityInfo