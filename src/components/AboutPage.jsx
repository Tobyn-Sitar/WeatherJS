import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CloudSun, Zap, Globe, Smartphone, Shield, Clock } from 'lucide-react'

export function AboutPage() {
  const features = [
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access weather data for cities worldwide with comprehensive location support."
    },
    {
      icon: Clock,
      title: "5-Day Forecasts", 
      description: "Plan ahead with detailed 5-day weather forecasts including temperature and conditions."
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Lightning-fast performance with real-time weather updates powered by OpenWeatherMap API."
    },
    {
      icon: Smartphone,
      title: "Modern Interface",
      description: "Clean, responsive design built with React and ShadCN/UI components for the best user experience."
    },
    {
      icon: Shield,
      title: "Accurate Data",
      description: "Trusted weather information from OpenWeatherMap, used by millions of applications worldwide."
    },
    {
      icon: CloudSun,
      title: "Detailed Conditions",
      description: "Get comprehensive weather details including temperature, humidity, and atmospheric conditions."
    }
  ]

  const technologies = [
    { name: "React 18", description: "Modern React with hooks and functional components" },
    { name: "Vite", description: "Fast build tool and development server" },
    { name: "TailwindCSS", description: "Utility-first CSS framework" },
    { name: "ShadCN/UI", description: "Beautiful, accessible UI components" },
    { name: "Radix UI", description: "Low-level UI primitives" },
    { name: "OpenWeatherMap API", description: "Reliable weather data provider" }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-b from-primary/5 to-transparent rounded-lg">
        <div className="flex justify-center mb-4">
          <CloudSun className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          About WeatherJS
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          WeatherJS is a modern, professional weather application built to provide accurate, real-time weather information for cities around the globe. Our mission is to make weather data accessible and beautiful.
        </p>
      </div>

      {/* Mission Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We believe that weather information should be fast, accurate, and beautifully presented. WeatherJS combines cutting-edge web technologies with reliable weather data to create an exceptional user experience.
        </p>
      </div>

      {/* Features Grid */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-foreground">Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Technology Stack */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-foreground">Built With</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <Card key={index} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{tech.name}</h3>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Why Choose WeatherJS?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Global</div>
              <p className="text-muted-foreground">Worldwide city coverage</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Real-time</div>
              <p className="text-muted-foreground">Up-to-date weather data</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">Modern</div>
              <p className="text-muted-foreground">Built with latest technologies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Ready to Explore?</h2>
        <p className="text-muted-foreground">
          Start by searching for your city or choosing from our popular destinations to see WeatherJS in action.
        </p>
      </div>
    </div>
  )
}