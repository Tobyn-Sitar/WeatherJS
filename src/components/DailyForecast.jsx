import React from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function DailyForecast({ days, onSelect }) {
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
                <img src={d.icon} alt={d.description} className="mx-auto w-12 h-12" />
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