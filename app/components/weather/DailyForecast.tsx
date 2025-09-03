import Image from 'next/image'
import { Card, CardContent } from "@/app/components/ui/card"
import { monthDayFromKey } from "@/app/lib/date"
import type { ForecastDay, HourlyData } from "@/app/types/weather"


interface DailyForecastProps {
  days?: ForecastDay[]
  onSelect: (day: ForecastDay) => void
}


export default function DailyForecast({ days, onSelect }: DailyForecastProps) {
  if (!days?.length) return null
  function weekdayFromKey(key: string) {
    const [y, m, d] = key.split('-').map(Number)
    const dt = new Date(Date.UTC(y, m - 1, d))
    return dt.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
  }
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
                <div className="font-medium">{weekdayFromKey(d.date)}</div>
                <div className="text-xs text-muted-foreground">
                  {monthDayFromKey(d.date)}
                </div>
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