import React, { useState } from "react";
import "./WeatherApp.css";
import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";

const WeatherApp = () => {
    let api_Key = "423a4c9e45476286c7d3554fb38edd02";

    const [wicon, setWicon] = useState(cloud_icon);
    const [cityInput, setCityInput] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");

    const search = async () => {
        if (cityInput === "") {
            return;
        }

        setSearching(true);
        setError(""); // Reset error state

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=Metric&appid=${api_Key}`;

        try {
            let response = await fetch(url);
            let data = await response.json();

            if (data.cod === "404") {
                setError("Please enter a valid city name");
                setWeatherData(null); // Clear previous weather data
                setSearching(false);
                return;
            }

            setWeatherData(data);

            if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
                setWicon(clear_icon);
            } else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
                setWicon(cloud_icon);
            } else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
                setWicon(drizzle_icon);
            } else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
                setWicon(cloud_icon);
            } else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
                setWicon(rain_icon);
            } else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
                setWicon(rain_icon);
            } else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
                setWicon(snow_icon);
            } else {
                setWicon(clear_icon);
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setError("An error occurred. Please try again later.");
        } finally {
            setSearching(false);
            setCityInput(""); // Clear input field after search
        }
    }

    const handleInputChange = (e) => {
        setCityInput(e.target.value);
        setError(""); // Reset error state when input changes
    }

    return (
        <section>
            <div className={`container ${searching ? 'minimized' : ''} ${weatherData ? 'expanded' : ''}`}>
                <div className="top-bar">
                    <input 
                        type="text" 
                        className="cityInput" 
                        placeholder="Search for city" 
                        value={cityInput} 
                        onChange={handleInputChange} 
                    />
                    <div className="search-icon" onClick={search}>
                        <img src={search_icon} alt="Search" />
                    </div>
                </div>
                {searching && (
                    <div className="loading">
                        <p>Loading...</p>
                    </div>
                )}
                {error && <div className="error">{error}</div>}
                {weatherData && (
                    <>
                        <div className="weather-image">
                            <img src={wicon} alt="Weather" />
                        </div>
                        <div className="weather-temp">{Math.floor(weatherData.main.temp)} °C</div>
                        <div className="weather-location">{weatherData.name}</div>
                        <div className="data-container">
                            <div className="element">
                                <img src={humidity_icon} alt="Humidity" className="icon" />
                                <div className="data">
                                    <div className="humidity-percent">{Math.floor(weatherData.main.humidity)} %</div>
                                    <div className="text">Humidity</div>
                                </div>
                            </div>
                            <div className="element">
                                <img src={wind_icon} alt="Wind Speed" className="icon" />
                                <div className="data">
                                    <div className="wind-rate">{Math.floor(weatherData.wind.speed)} km/h</div>
                                    <div className="text">Wind Speed</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default WeatherApp;
