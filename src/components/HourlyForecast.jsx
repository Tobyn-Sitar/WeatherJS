import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export default function HourlyForecast({ day, onOpenChange }) {
  const open = Boolean(day)
  const hourly = day?.hourlyData ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{day?.dayOfWeek || "Hourly Forecast"}</DialogTitle>
          {day?.description ? (
            <DialogDescription className="capitalize">{day.description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {hourly.length === 0 ? (
          <div className="text-sm text-muted-foreground">No hourly data available.</div>
        ) : (
          <ul className="divide-y">
            {hourly.map((h) => (
              <li key={h.dt} className="flex items-center justify-between py-2">
                <div className="w-16">{h.time}</div>
                <img src={h.icon} alt={h.description} className="w-8 h-8" />
                <div className="w-16 text-right">{h.tempF}°F</div>
                <div className="w-24 text-right">{h.windMph} mph</div>
                <div className="w-20 text-right">{h.humidity}%</div>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}