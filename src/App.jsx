import React, { useState } from 'react'
import { ModeToggle } from './components/ui/mode-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import HomePage from './components/HomePage'
import { AboutPage } from './components/AboutPage'
import { ApiPage } from './components/ApiPage'
import { CloudSun } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState("home")

  const handleLogoClick = () => {
    setActiveTab("home")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <CloudSun className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">WeatherJS</h1>
            </button>
            
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>
            
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <div className="container mx-auto px-4 py-8">
        <TabsContent value="home" className="mt-0">
          <HomePage />
        </TabsContent>
        
        <TabsContent value="about" className="mt-0">
          <AboutPage />
        </TabsContent>
        
        <TabsContent value="api" className="mt-0">
          <ApiPage />
        </TabsContent>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-32">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 WeatherJS. Built with React, TailwindCSS, and ShadCN/UI.</p>
            <p className="mt-1">
              Weather data provided by{' '}
              <a href="https://openweathermap.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                OpenWeatherMap
              </a>
            </p>
          </div>
        </div>
      </footer>
    </Tabs>
  )
}

export default App