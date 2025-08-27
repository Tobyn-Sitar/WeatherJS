const API_KEY = import.meta.env.VITE_OWM_API_KEY
const BASE_URL = 'https://api.openweathermap.org'

const toIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`

export async function getCurrentWeather(city) {
  const url = `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 404) throw new Error('City not found')
    if (res.status === 429) throw new Error('Rate limit reached. Try again soon.')
    throw new Error('Failed to fetch current weather')
  }
  const data = await res.json()
  return normalizeCurrentWeather(data)
}

export async function getForecast(city) {
  const url = `${BASE_URL}/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=imperial`
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limit reached. Try again soon.')
    throw new Error('Failed to fetch forecast')
  }
  const data = await res.json()
  const tz = data.city?.timezone ?? 0 // seconds offset from UTC
  return normalizeForecastList(data.list, tz)
}

export async function getByCoords(lat, lon) {
  const [current, forecast] = await Promise.all([
    fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`).then(h => h.json()),
    fetch(`${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`).then(h => h.json())
  ])
  return {
    current: normalizeCurrentWeather(current),
    forecast: normalizeForecastList(forecast.list, forecast.city?.timezone ?? 0)
  }
}

export async function searchCities(query, limit = 5) {
  if (!query) return []
  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  return json.map(c => ({
    name: c.name,
    state: c.state || '',
    country: c.country || '',
    displayName: `${c.name}${c.state ? ', ' + c.state : ''}, ${c.country}`
  }))
}

// helper: format YYYY-MM-DD using UTC getters (after applying tz offset)
function dateKeyFrom(dtSeconds, tzOffsetSeconds) {
  const ms = (dtSeconds + tzOffsetSeconds) * 1000
  const d = new Date(ms)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

// helper: localized hour string after tz offset, using UTC display because the offset is pre-applied
function hourLabelFrom(dtSeconds, tzOffsetSeconds) {
  const ms = (dtSeconds + tzOffsetSeconds) * 1000
  const d = new Date(ms)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: 'UTC' })
}

// Group the 3-hour forecast into local days using the city timezone
function normalizeForecastList(list, tzOffsetSeconds = 0) {
  const byDate = {}
  for (const item of list) {
    const key = dateKeyFrom(item.dt, tzOffsetSeconds)
    if (!byDate[key]) byDate[key] = []
    byDate[key].push(item)
  }

  const days = Object.keys(byDate).slice(0, 5).map(date => {
    const entries = byDate[date]
    // choose midday-ish entry in LOCAL time for icon/summary
    const noonish = entries.find(e => {
      const ms = (e.dt + tzOffsetSeconds) * 1000
      const h = new Date(ms).getUTCHours() // use UTC hours because tz already applied
      return h >= 11 && h <= 14
    }) || entries[0]

    const temps = entries.map(e => e.main.temp)

    return {
      date,
      dayOfWeek: new Date((entries[0].dt + tzOffsetSeconds) * 1000)
        .toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }),
      icon: toIconUrl(noonish.weather[0].icon),
      description: noonish.weather[0].description,
      minF: Math.round(Math.min(...temps)),
      maxF: Math.round(Math.max(...temps)),
      hourlyData: entries.map(e => ({
        dt: e.dt,
        time: hourLabelFrom(e.dt, tzOffsetSeconds),
        tempF: Math.round(e.main.temp),
        windMph: Math.round(e.wind?.speed || 0),
        humidity: e.main.humidity,
        description: e.weather?.[0]?.description || '',
        icon: toIconUrl(e.weather?.[0]?.icon || '01d'),
      })),
    }
  })

  return { days }
}

function normalizeCurrentWeather(data) {
  return {
    city: data.name,
    country: data.sys?.country || '',
    coord: data.coord,
    tempF: Math.round(data.main.temp),
    tempC: Math.round((data.main.temp - 32) * 5 / 9),
    feelsLikeF: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windMph: Math.round(data.wind?.speed || 0),
    description: data.weather?.[0]?.description || '',
    icon: toIconUrl(data.weather?.[0]?.icon || '01d'),
    dt: data.dt
  }
}