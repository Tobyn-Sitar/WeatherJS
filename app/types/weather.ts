export interface WeatherData {
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

export interface HourlyData {
  dt: number
  time: string
  tempF: number
  windMph: number
  humidity: number
  description: string
  icon: string
}

export interface ForecastDay {
  date: string
  dayOfWeek: string
  icon: string
  description: string
  minF: number
  maxF: number
  hourlyData: HourlyData[]
}

export interface ForecastData {
  days: ForecastDay[]
}