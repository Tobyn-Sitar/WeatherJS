import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Code, Database, Key, Zap, Shield, Globe } from 'lucide-react'

export function ApiPage() {
  const endpoints = [
    {
      method: "GET",
      endpoint: "/data/2.5/weather",
      description: "Get current weather data for a specific city",
      parameters: [
        { name: "q", type: "string", required: true, description: "City name, state code and country code divided by comma" },
        { name: "appid", type: "string", required: true, description: "Your unique API key" },
        { name: "units", type: "string", required: false, description: "Units of measurement (imperial, metric, kelvin)" }
      ],
      example: "https://api.openweathermap.org/data/2.5/weather?q=London,UK&appid=YOUR_API_KEY&units=imperial"
    },
    {
      method: "GET", 
      endpoint: "/data/2.5/forecast",
      description: "Get 5-day weather forecast with data every 3 hours",
      parameters: [
        { name: "q", type: "string", required: true, description: "City name, state code and country code divided by comma" },
        { name: "appid", type: "string", required: true, description: "Your unique API key" },
        { name: "units", type: "string", required: false, description: "Units of measurement (imperial, metric, kelvin)" }
      ],
      example: "https://api.openweathermap.org/data/2.5/forecast?q=London,UK&appid=YOUR_API_KEY&units=imperial"
    },
    {
      method: "GET",
      endpoint: "/geo/1.0/direct",
      description: "Get geographical coordinates by city name for geocoding",
      parameters: [
        { name: "q", type: "string", required: true, description: "City name, state code and country code divided by comma" },
        { name: "limit", type: "number", required: false, description: "Number of the locations in the API response (up to 5)" },
        { name: "appid", type: "string", required: true, description: "Your unique API key" }
      ],
      example: "https://api.openweathermap.org/geo/1.0/direct?q=London,UK&limit=5&appid=YOUR_API_KEY"
    }
  ]

  const features = [
    {
      icon: Database,
      title: "Comprehensive Data",
      description: "Access current weather, forecasts, and historical data for over 200,000 cities worldwide."
    },
    {
      icon: Zap,
      title: "Fast Response Times",
      description: "Lightning-fast API responses with 99.9% uptime guarantee for reliable weather data."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with API key authentication and rate limiting protection."
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Worldwide weather data coverage with support for multiple languages and units."
    }
  ]

  const responseExample = `{
  "coord": {
    "lon": -0.1257,
    "lat": 51.5085
  },
  "weather": [
    {
      "id": 800,
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 72.5,
    "feels_like": 71.8,
    "temp_min": 69.3,
    "temp_max": 75.2,
    "pressure": 1013,
    "humidity": 45
  },
  "visibility": 10000,
  "wind": {
    "speed": 8.5,
    "deg": 270
  },
  "clouds": {
    "all": 0
  },
  "dt": 1647875400,
  "sys": {
    "type": 2,
    "id": 2019646,
    "country": "GB",
    "sunrise": 1647847200,
    "sunset": 1647890400
  },
  "timezone": 0,
  "id": 2643743,
  "name": "London",
  "cod": 200
}`

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-b from-primary/5 to-transparent rounded-lg">
        <div className="flex justify-center mb-4">
          <Code className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          API Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          WeatherJS is powered by the OpenWeatherMap API, providing reliable and accurate weather data. Learn how to integrate weather information into your applications.
        </p>
      </div>

      {/* Getting Started */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Getting Started</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              To use the OpenWeatherMap API, you need to sign up for a free API key:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Visit <a href="https://openweathermap.org/api" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">OpenWeatherMap API</a></li>
              <li>Create a free account</li>
              <li>Generate your API key</li>
              <li>Start making API calls (up to 1,000 calls/day for free)</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* API Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">API Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Endpoints */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">API Endpoints</h2>
        <div className="space-y-6">
          {endpoints.map((endpoint, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {endpoint.endpoint}
                  </code>
                </div>
                <p className="text-muted-foreground">{endpoint.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Parameters:</h4>
                  <div className="space-y-2">
                    {endpoint.parameters.map((param, paramIndex) => (
                      <div key={paramIndex} className="flex items-start gap-2 text-sm">
                        <code className="bg-muted px-2 py-1 rounded text-xs">{param.name}</code>
                        <Badge variant="outline" className="text-xs">
                          {param.type}
                        </Badge>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <span className="text-muted-foreground">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">
                    {endpoint.example}
                  </code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Response Example */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Response Example</h2>
        <Card>
          <CardHeader>
            <CardTitle>Current Weather Response</CardTitle>
            <p className="text-muted-foreground">
              Example JSON response from the current weather endpoint:
            </p>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
              <code>{responseExample}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limits */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Rate Limits</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">1,000</div>
                <p className="text-sm text-muted-foreground">Calls per day (Free)</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">60</div>
                <p className="text-sm text-muted-foreground">Calls per minute</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime guarantee</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Need Help?</h2>
        <p className="text-muted-foreground">
          Check out the{' '}
          <a href="https://openweathermap.org/api" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            OpenWeatherMap documentation
          </a>{' '}
          for more detailed information about available endpoints and features.
        </p>
      </div>
    </div>
  )
}