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
  
  return days.map((date, index) => {
    const firstForecast = groupedByDay[date][0]
    const dayData = groupedByDay[date]
    
    return {
      dayOfWeek: formatDayOfWeek(firstForecast.dt),
      time: formatTime(firstForecast.dt),
      temp: Math.round(firstForecast.main.temp),
      description: firstForecast.weather[0].description,
      icon: firstForecast.weather[0].icon,
      date: date,
      hourlyData: dayData, // Include all hourly data for this day
      dayIndex: index
    }
  })
}

export function getHourlyForecastForDay(hourlyData, maxHours = 12) {
  const now = new Date()
  const currentHour = now.getHours()
  
  // Filter data to show only upcoming hours or until end of day
  const filteredData = hourlyData.filter(item => {
    const itemDate = new Date(item.dt * 1000)
    const itemHour = itemDate.getHours()
    
    // For today, show from current hour onwards
    if (itemDate.toDateString() === now.toDateString()) {
      return itemHour >= currentHour
    }
    
    // For future days, show all hours
    return true
  }).slice(0, maxHours)
  
  return filteredData.map(item => ({
    time: formatTime(item.dt),
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    humidity: item.main.humidity,
    windSpeed: Math.round(item.wind.speed),
    feelsLike: Math.round(item.main.feels_like)
  }))
}