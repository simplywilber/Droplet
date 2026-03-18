import { useState, useEffect } from "react";
import { useWeather } from "../context/WeatherContext";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

// Map weather conditions to background gradients
const WEATHER_BG = {
  Clear: "linear-gradient(to bottom, #56CCF2, #2F80ED)",
  Clouds: "linear-gradient(to bottom, #bdc3c7, #2c3e50)",
  Rain: "linear-gradient(to bottom, #4b79a1, #283e51)",
  Thunderstorm: "linear-gradient(to bottom, #2c3e50, #000000)",
  Snow: "linear-gradient(to bottom, #83a4d4, #b6fbff)",
  Mist: "linear-gradient(to bottom, #757f9a, #d7dde8)",
  Haze: "linear-gradient(to bottom, #f0f2f0, #000c40)",
};

function Home() {
  const { city, setCity, state, setState, coords, setCoords, clearCoords } = useWeather();
  const date = new Date();
  const hour = date.getHours();
  let greeting =
    hour >= 5 && hour < 12
      ? "Good Morning,"
      : hour >= 12 && hour < 18
        ? "Good Afternoon,"
        : "Good Evening,";

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather by coordinates
  const fetchByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`,
      );
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
      setCity(data.name);
      setCoords({ lat, lon });
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve weather. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city + state
  const fetchByCityState = async () => {
    if (!city || !state) {
      setError("Please enter a city and select a state.");
      return;
    }
    const query = `${city},${state},US`;
    try {
      setLoading(true);
      setError("");
      clearCoords();
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=${API_KEY}`,
      );
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
    } catch (err) {
      console.error(err);
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (coords) {
      fetchByCoords(coords.lat, coords.lon);
    } else if (city && state) {
      fetchByCityState();
    }
  }, []); // Run once on mount

  // Use my location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchByCoords(position.coords.latitude, position.coords.longitude),
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location.");
        setLoading(false);
      },
    );
  };

  const getBackground = () => {
    if (!weather) return "linear-gradient(to bottom, #78b3c7, #4098cb)";
    const condition = weather.weather[0].main;
    return (
      WEATHER_BG[condition] || "linear-gradient(to bottom, #56CCF2, #2F80ED)"
    );
  };

  // Determine image: umbrella if rain/thunderstorm
  const getWeatherImage = () => {
    if (!weather) return null;
    const condition = weather.weather[0].main;
    if (condition === "Rain" || condition === "Thunderstorm")
      return "images/umbrella-icon.png";
    return `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  };

  return (
    <div id="container-home" style={{ background: getBackground() }}>
    {/* Weather search bar */}
      <div id="weather-search">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchByCityState()}
        />
        <select value={state} onChange={(e) => setState(e.target.value)}>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button onClick={fetchByCityState} className="custom-btn" id="search-btn">Search</button>
        <button onClick={handleUseMyLocation} className="custom-btn"><img src="/images/location-vector.svg" id="location-icon"></img></button>
      </div>
      <div id="weather-section">
        {/* Left: Greeting + info */}
        <div id="weather-container">
          <h1>{greeting}</h1>
          {loading ? (
            <p>Loading weather...</p>
          ) : (
            weather && (
              <>
                <h2>
                  {weather.name}, {weather.sys.country}
                </h2>
                {!loading && weather && (
                  <img
                    alt="Weather icon"
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  />
                )}
                <p>Feels like {Math.round(weather.main.temp)}°F</p>
                <p>{weather.weather[0].description}</p>
              </>
            )
          )}
          {error && <p className="error">{error}</p>}
        </div>

        {/* Right: Search + Image */}
        <div id="weather-side">
          {!loading && weather && (
            <img id="weather-img" alt="Weather icon" src={getWeatherImage()} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
