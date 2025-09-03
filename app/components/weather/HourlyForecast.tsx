import Image from 'next/image'
import type { HourlyData, ForecastDay } from "@/app/types/weather"

interface HourlyForecastProps {
  day: ForecastDay | null
}

export default function HourlyForecast({ day }: HourlyForecastProps) {
  const hourly = day?.hourlyData ?? []

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Hourly Forecast</h2>
      {hourly.length === 0 ? (
        <div className="text-sm text-muted-foreground">No hourly data available.</div>
      ) : (
        <div className="bg-card rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-center p-3 font-medium">Weather</th>
                  <th className="text-right p-3 font-medium">Temp</th>
                  <th className="text-right p-3 font-medium">Wind</th>
                  <th className="text-right p-3 font-medium">Humidity</th>
                </tr>
              </thead>
              <tbody>
                {hourly.map((h) => (
                  <tr key={h.dt} className="border-b last:border-b-0">
                    <td className="p-3">{h.time}</td>
                    <td className="p-3 text-center">
                      <Image src={h.icon} alt={h.description} width={32} height={32} className="mx-auto" />
                    </td>
                    <td className="p-3 text-right">{h.tempF}°F</td>
                    <td className="p-3 text-right">{h.windMph} mph</td>
                    <td className="p-3 text-right">{h.humidity}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}