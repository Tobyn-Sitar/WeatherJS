import React from 'react';
import WeatherCard from './WeatherCard';

const DailyForecast = ({ data }) => {
  if (!data || !data.forecast || !data.forecast.forecastday) {
    return null;
  }

  const { forecastday } = data.forecast;

  return (
    <div>
      <h2>Daily Forecast</h2>
      <div>
        {forecastday.map((day, index) => (
          <WeatherCard key={day.date || index} dayData={day} />
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;