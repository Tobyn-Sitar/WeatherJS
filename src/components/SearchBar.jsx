import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() && !loading) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !city.trim()}>
          {loading ? 'Searching...' : 'Get Weather'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;