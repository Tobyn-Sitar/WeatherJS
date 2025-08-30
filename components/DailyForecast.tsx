import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

interface HourlyData {
  dt: number
  time: string
  tempF: number
  windMph: number
  humidity: number
  description: string
  icon: string
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

interface DailyForecastProps {
  days?: ForecastDay[]
  onSelect: (day: ForecastDay) => void
}

export default function DailyForecast({ days, onSelect }: DailyForecastProps) {
  if (!days?.length) return null
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">5-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {days.map((d) => (
          <Card key={d.date} className="hover:bg-accent">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onSelect?.(d)
              }}
              className="w-full"
              aria-label={`Open hourly forecast for ${d.dayOfWeek}`}
            >
              <CardContent className="p-3 text-center">
                <div className="font-medium">{d.dayOfWeek}</div>
                <Image src={d.icon} alt={d.description} width={48} height={48} className="mx-auto" />
                <div className="text-sm capitalize">{d.description}</div>
                <div className="text-sm mt-1">{d.maxF}° / {d.minF}°</div>
              </CardContent>
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}