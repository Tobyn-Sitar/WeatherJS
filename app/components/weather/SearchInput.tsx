'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/components/ui/button"
import { searchCities } from "@/app/lib/api"

interface City {
  name: string
  state: string
  country: string
  displayName: string
  lat: number
  lon: number
}

interface SearchInputProps {
  onSearch: (query: string) => void
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [q, setQ] = useState("")
  const [suggestions, setSuggestions] = useState<City[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const city = q.trim()
    if (city) {
      onSearch?.(city)
      setShowSuggestions(false)
      setSuggestions([])
    }
  }

  function selectSuggestion(suggestion: City) {
    setQ(suggestion.displayName)
    onSearch?.(suggestion.displayName)
    setShowSuggestions(false)
    setSuggestions([])
    setSelectedIndex(-1)
  }

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (q.trim().length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }
      
      try {
        const results = await searchCities(q.trim())
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [q])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault()
          selectSuggestion(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        onSearch?.(`${lat},${lon}`)
      },
      (err) => console.error("geolocation error", err),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={submit} className="flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter city name…"
            className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            aria-label="City"
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.name}-${suggestion.state || ''}-${suggestion.country}-${suggestion.lat}-${suggestion.lon}`}
                  type="button"
                  className={`w-full px-3 py-2 text-left hover:bg-muted transition-colors ${
                    index === selectedIndex ? 'bg-muted' : ''
                  }`}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  <div className="font-medium">{suggestion.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <Button type="submit">Search</Button>
        <Button type="button" variant="outline" onClick={useMyLocation} aria-label="Use my location">📍</Button>
      </form>
    </div>
  )
}