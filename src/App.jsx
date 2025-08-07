import React, { useState, useEffect } from 'react'
import { ModeToggle } from './components/ui/mode-toggle'
import { Card, CardContent } from './components/ui/card'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { fetchCityWeather, fetch5DayForecast, searchCities } from './lib/weather-api'
import { groupForecastsByDay } from './lib/weather-utils'

const CITIES = [
  'New York',
  'London', 
  'San Francisco',
  'Tokyo',
  'Paris',
  'Berlin',
  'Sydney',
  'Toronto'
]

function App() {
  const [selectedCity, setSelectedCity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [cityWeather, setCityWeather] = useState({})
  const [forecast, setForecast] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load weather data for header cities on mount
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

  const handleLogoClick = () => {
    setSelectedCity('')
    setSearchQuery('')
    setForecast([])
    setSuggestions([])
    setShowSuggestions(false)
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Theme Toggle */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogoClick}
                className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
              >
                WeatherJS
              </button>
              <ModeToggle />
            </div>
            
            {/* City Cards */}
            <div className="flex gap-2 overflow-hidden">
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
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="flex gap-2 w-full max-w-md">
            <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
              <PopoverTrigger asChild>
                <div className="flex-1">
                  <Input
                    placeholder="Search for a city..."
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
              <PopoverContent className="w-full p-0">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className="p-2 hover:bg-accent cursor-pointer"
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

      {/* Forecast Section */}
      {forecast.length > 0 && (
        <div className="container mx-auto px-4 pb-8">
          <div className="flex justify-center">
            <div className="flex gap-4 overflow-x-auto">
              {forecast.map((day, index) => (
                <Card key={index} className="min-w-[200px]">
                  <CardContent className="p-4 text-center">
                    <div className="font-medium">{day.dayOfWeek}</div>
                    <div className="text-sm text-muted-foreground">{day.time}</div>
                    <div className="text-lg font-bold mt-2">{day.temp}°F</div>
                    <div className="text-sm text-muted-foreground mt-1">{day.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App