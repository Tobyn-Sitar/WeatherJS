import React from 'react';

const WeatherCard = ({ dayData }) => {
  if (!dayData || !dayData.day) {
    return null;
  }

  const { date, day } = dayData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '15px' }}>
      <h4>{formatDate(date)}</h4>
      <div>
        {day.condition?.icon && (
          <img src={day.condition.icon} alt={day.condition.text} />
        )}
        <p>{day.condition?.text}</p>
      </div>
      <div>
        <p>High: {day.maxtemp_c}°C ({day.maxtemp_f}°F)</p>
        <p>Low: {day.mintemp_c}°C ({day.mintemp_f}°F)</p>
        <p>Chance of Rain: {day.daily_chance_of_rain}%</p>
        <p>Humidity: {day.avghumidity}%</p>
        <p>Max Wind: {day.maxwind_kph} km/h</p>
        <p>UV Index: {day.uv}</p>
      </div>
    </div>
  );
};

export default WeatherCard;