"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loading from '../loading';

const CurrentWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = '98cd9888def271fe656d056b7f4c075f';
  // const apiKey = '5b2a1e0d8a4e1e0e0a4e0d8a4e1e0e0'; 

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      try {
        const locationResponse = await fetch('http://ip-api.com/json');
        if (!locationResponse.ok) {
          throw new Error('Failed to fetch location data ');
        }

        const locationData = await locationResponse.json();
        const city = locationData.city; 

        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data ');
        }

        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
      } catch (e) {
        setWeather(null); 
      }finally{
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  return (<>
      {weather && !loading ? (
        <>
          <Image id='weather_icon'
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          width={50}
          height={50}
          />
          <p> {weather.name} . {weather.main.temp}°C</p>
        </>
      ) : (
        <p>Loading weather...</p>
      )}
      </>
  );
};

export default CurrentWeather;
