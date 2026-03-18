import { useState } from "react";

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

// Images corresponding to weather
const WEATHER_IMAGE = {
  Rain: "/images/umbrella-icon.png",
  Drizzle: "/images/umbrella-icon.png",
  Thunderstorm: "/images/umbrella-icon.png",
  Snow: "/images/snow.png",
  Clear: "/images/sun.png",
  Clouds: "/images/clouds.png",
  Mist: "/images/mist.png",
  Haze: "/images/haze.png",
};

function Home() {
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
  const [city, setCity] = useState("");
  const [state, setState] = useState("WA");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

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
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve weather. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCityState = async () => {
    if (!city || !state) {
      setError("Please enter a city and select a state.");
      return;
    }
    const query = `${city},${state},US`;
    try {
      setLoading(true);
      setError("");
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

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchByCoords(position.coords.latitude, position.coords.longitude);
      },
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

  return (
    <div id="container-home" style={{ background: getBackground() }}>
      <div
        id="weather-section"
        className={!loading && weather ? "with-image" : "no-image"}
      >
        <div id="weather-container">
          <h1>{greeting}</h1>

          {/* City + State Inputs */}
          <div>
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
            <button className="logout-btn" onClick={fetchByCityState}>
              Search
            </button>
          </div>

          {/* Use My Location */}
          <div>
            <button onClick={handleUseMyLocation}>Use My Location</button>
          </div>

          {/* Error Display */}
          {error && <p className="error">{error}</p>}

          {/* Weather Display */}
          {loading ? (
            <p>Loading weather...</p>
          ) : weather ? (
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
          ) : null}
        </div>

        {/* Weather Icon */}
        {!loading && weather && (
          <img
            id="weather-img"
            alt="Weather icon"
            src={
              WEATHER_IMAGE[weather.weather[0].main] ||
              `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
            }
          />
        )}
      </div>
    </div>
  );
}

export default Home;
