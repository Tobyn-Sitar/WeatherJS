import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Clock, Droplets, Wind, Thermometer } from 'lucide-react'
import { getHourlyForecastForDay } from '../lib/weather-utils'

export function HourlyForecast({ day, children }) {
  if (!day || !day.hourlyData) {
    return children
  }

  const hourlyData = getHourlyForecastForDay(day.hourlyData, 12)

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5" />
            {day.dayOfWeek} - Hourly Forecast
          </DialogTitle>
          <p className="text-muted-foreground">
            Next {hourlyData.length} hours of weather data
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{day.temp}°F</div>
                  <p className="text-sm text-muted-foreground">Current</p>
                </div>
                <div>
                  <div className="text-lg font-semibold capitalize">{day.description}</div>
                  <p className="text-sm text-muted-foreground">Conditions</p>
                </div>
                <div>
                  <div className="text-lg font-semibold">{hourlyData.length}</div>
                  <p className="text-sm text-muted-foreground">Hours shown</p>
                </div>
                <div>
                  <Badge variant="outline" className="text-xs">
                    Updated: {day.time}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hourlyData.map((hour, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Time and Temperature */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{hour.time}</span>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {hour.temp}°F
                      </div>
                    </div>

                    {/* Weather Description */}
                    <div className="text-center py-2">
                      <p className="text-sm capitalize text-muted-foreground mb-1">
                        {hour.description}
                      </p>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3 text-orange-500" />
                        <span className="text-muted-foreground">
                          {hour.feelsLike}°F
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">
                          {hour.humidity}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="h-3 w-3 text-gray-500" />
                        <span className="text-muted-foreground">
                          {hour.windSpeed}mph
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Info */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            <p>Click outside to close • Weather data updates every 3 hours</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}