import React from 'react';

const CityInfo = ({ data }) => {
  if (!data || !data.current) {
    return null;
  }

  const { current, location } = data;

  return (
    <div>
      <h2>Current Weather</h2>
      <div>
        <h3>{location?.name || 'Unknown City'}</h3>
        {location?.country && <p>Country: {location.country}</p>}
        {location?.region && <p>Region: {location.region}</p>}
      </div>
      <div>
        <p>Temperature: {current.temp_c}°C ({current.temp_f}°F)</p>
        <p>Condition: {current.condition?.text}</p>
        <p>Feels like: {current.feelslike_c}°C ({current.feelslike_f}°F)</p>
        <p>Humidity: {current.humidity}%</p>
        <p>Wind: {current.wind_kph} km/h ({current.wind_dir})</p>
        <p>Pressure: {current.pressure_mb} mb</p>
        <p>UV Index: {current.uv}</p>
        {current.condition?.icon && (
          <img src={current.condition.icon} alt={current.condition.text} />
        )}
      </div>
    </div>
  );
};

export default CityInfo;