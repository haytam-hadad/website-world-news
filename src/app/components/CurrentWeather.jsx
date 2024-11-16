"use client";
import { useEffect, useState } from 'react';

const CurrentWeather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const apiKey = '98cd9888def271fe656d056b7f4c075f'; 

  useEffect(() => {
    const getWeather = async () => {
      try {
        const locationResponse = await fetch('https://ip-api.com/json');
        if (!locationResponse.ok) {
          throw new Error('Failed to fetch location data');
        }

        const locationData = await locationResponse.json();
        const city = locationData.city; 

        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setWeather(null); 
      }
    };

    getWeather();
  }, [apiKey]);

  return (<>
      {error && <p>Error: {error}</p>}
      {weather ? (
        <>
          <img id='weather_icon'
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          />
          <p> {weather.name} -{weather.main.temp}°C -{weather.weather[0].description}</p>
        </>

      ) : (
        <p>Loading weather...</p>
      )}
      </>
  );
};

export default CurrentWeather;
