import React, { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { fetchCityWeather, fetch5DayForecast, searchCities } from '../lib/weather-api'
import { groupForecastsByDay } from '../lib/weather-utils'
import { HourlyForecast } from './HourlyForecast'
import { CloudSun } from 'lucide-react'

const CITIES = [
  'New York',
  'San Francisco',
  'Chicago'
]

export function HomePage() {
  const [selectedCity, setSelectedCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [cityWeather, setCityWeather] = useState({})
  const [forecast, setForecast] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load weather data for city buttons on mount
  useEffect(() => {
    const loadCityWeather = async () => {
      const weatherData = {}
      for (const city of CITIES) {
        const weather = await fetchCityWeather(city)
        if (weather) {
          weatherData[city] = weather.temp
        }
      }
      setCityWeather(weatherData)
    }
    loadCityWeather()
  }, [])

  // Handle search input changes for autocomplete
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length >= 2) {
        const results = await searchCities(searchQuery)
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }
    
    const debounceTimer = setTimeout(handleSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleCityClick = async (cityName) => {
    setSelectedCity(cityName)
    await fetchWeather(cityName)
  }

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return
    
    setIsLoading(true)
    try {
      const forecastData = await fetch5DayForecast(cityName)
      const groupedForecast = groupForecastsByDay(forecastData)
      setForecast(groupedForecast)
      setSelectedCity(cityName)
    } catch (error) {
      console.error('Error fetching weather:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.displayName)
    setShowSuggestions(false)
    fetchWeather(suggestion.name)
  }

  const handleSearchSubmit = () => {
    fetchWeather(searchQuery)
    setShowSuggestions(false)
  }

  const clearResults = () => {
    setSelectedCity('')
    setSearchQuery('')
    setForecast([])
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <div className="text-center py-8 bg-gradient-to-b from-primary/5 to-transparent rounded-lg">
        <div className="flex justify-center mb-4">
          <CloudSun className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          WeatherJS
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get accurate weather forecasts for cities around the world. View current conditions and 5-day forecasts with our modern, responsive interface.
        </p>
      </div>

      {/* Quick Access Cities */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center text-foreground">Popular Cities</h2>
        <div className="flex justify-center">
          <div className="flex gap-2 flex-wrap justify-center max-w-4xl">
            {CITIES.map((city) => (
              <Card 
                key={city}
                className="cursor-pointer hover:bg-accent transition-colors min-w-[120px]"
                onClick={() => handleCityClick(city)}
              >
                <CardContent className="p-3 text-center">
                  <div className="font-medium text-sm">{city}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {cityWeather[city] ? `${cityWeather[city]}°F` : 'Loading...'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center text-foreground">Search Any City</h2>
        <div className="flex justify-center">
          <div className="flex gap-2 w-full max-w-md">
            <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
              <PopoverTrigger asChild>
                <div className="flex-1">
                  <Input
                    placeholder="Enter city name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit()
                      }
                    }}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.displayName}
                  </div>
                ))}
              </PopoverContent>
            </Popover>
            <Button onClick={handleSearchSubmit} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Search'}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {forecast.length > 0 && (
        <div className="space-y-6">
          {/* Selected City Display */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-semibold text-foreground">
                {selectedCity}
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearResults}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div>
            <h3 className="text-xl font-medium text-center mb-4 text-foreground">5-Day Forecast</h3>
            <p className="text-center text-sm text-muted-foreground mb-4">Click on any day to view hourly forecast</p>
            <div className="flex justify-center">
              <div className="flex gap-4 overflow-x-auto max-w-6xl pb-2">
                {forecast.map((day, index) => (
                  <HourlyForecast key={index} day={day}>
                    <Card className="min-w-[200px] flex-shrink-0 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200">
                      <CardContent className="p-4 text-center">
                        <div className="font-medium text-base">{day.dayOfWeek}</div>
                        <div className="text-sm text-muted-foreground mt-1">{day.time}</div>
                        <div className="text-2xl font-bold mt-3 mb-2">{day.temp}°F</div>
                        <div className="text-sm text-muted-foreground capitalize">{day.description}</div>
                        <div className="text-xs text-primary mt-2 font-medium">
                          Click for hourly details →
                        </div>
                      </CardContent>
                    </Card>
                  </HourlyForecast>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}