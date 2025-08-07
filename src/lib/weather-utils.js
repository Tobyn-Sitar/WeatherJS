export function formatTime(timestamp) {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

export function formatDayOfWeek(timestamp) {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export function groupForecastsByDay(forecastList) {
  const groupedByDay = {}
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!groupedByDay[date]) {
      groupedByDay[date] = []
    }
    groupedByDay[date].push(item)
  })
  
  // Get first 5 different days and take the first forecast of each day
  const days = Object.keys(groupedByDay).slice(0, 5)
  
  return days.map(date => {
    const firstForecast = groupedByDay[date][0]
    return {
      dayOfWeek: formatDayOfWeek(firstForecast.dt),
      time: formatTime(firstForecast.dt),
      temp: Math.round(firstForecast.main.temp),
      description: firstForecast.weather[0].description,
      icon: firstForecast.weather[0].icon
    }
  })
}