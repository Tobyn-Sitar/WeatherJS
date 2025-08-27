import React from "react"
import { Button } from "@/components/ui/button"
import { searchCities } from "@/lib/weather-api"

export default function SearchInput({ onSearch }) {
  const [q, setQ] = React.useState("")
  const [suggestions, setSuggestions] = React.useState([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  const inputRef = React.useRef(null)
  const suggestionsRef = React.useRef(null)

  function submit(e) {
    e.preventDefault()
    const city = q.trim()
    if (city) {
      onSearch?.(city)
      setShowSuggestions(false)
      setSuggestions([])
    }
  }

  function selectSuggestion(suggestion) {
    setQ(suggestion.displayName)
    onSearch?.(suggestion.displayName)
    setShowSuggestions(false)
    setSuggestions([])
    setSelectedIndex(-1)
  }

  React.useEffect(() => {
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

  function handleKeyDown(e) {
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

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
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
                  key={`${suggestion.name}-${suggestion.country}`}
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