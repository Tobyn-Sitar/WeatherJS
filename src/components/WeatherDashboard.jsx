import React, { useState } from 'react';
import SearchBar from './SearchBar';
import CityInfo from './CityInfo';
import DailyForecast from './DailyForecast';
import { fetchCityWeather, fetch5DayForecast } from '../lib/weather-api';
import { groupForecastsByDay } from '../lib/weather-utils';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentWeather, forecastData] = await Promise.all([
        fetchCityWeather(city),
        fetch5DayForecast(city)
      ]);
      
      if (!currentWeather) {
        throw new Error('Weather data not found');
      }
      
      const groupedForecast = groupForecastsByDay(forecastData);
      
      setWeatherData({
        current: currentWeather,
        forecast: groupedForecast,
        city: city
      });
    } catch (err) {
      setError(`Failed to fetch weather data: ${err.message}`);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchBar onSearch={fetchWeatherData} loading={loading} />
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}
      
      {loading && (
        <div>Loading weather data...</div>
      )}
      
      {weatherData && !loading && (
        <div>
          <CityInfo data={weatherData} />
          <DailyForecast data={weatherData} />
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;