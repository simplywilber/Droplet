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

const STATE_FULL_NAME_BY_CODE = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

/**
 * Maps weather conditions to CSS background gradients for dynamic visual theming.
 * Each condition has a unique gradient that reflects the weather mood.
 */
const WEATHER_BG = {
  Clear: "linear-gradient(to bottom, #56CCF2, #2F80ED)",
  Clouds: "linear-gradient(to bottom, #586166, #2c3d4f)",
  Rain: "linear-gradient(to bottom, #4b79a1, #283e51)",
  Thunderstorm: "linear-gradient(to bottom, #2c3e50, #000000)",
  Snow: "linear-gradient(to bottom, #83a4d4, #b6fbff)",
  Mist: "linear-gradient(to bottom, #757f9a, #d7dde8)",
  Haze: "linear-gradient(to bottom, #f0f2f0, #000c40)",
};

/**
 * Home page component for weather display and search functionality.
 * Handles weather fetching by city/state or geolocation, with dynamic backgrounds
 * and time-based greetings.
 */
function Home() {
  const { city, setCity, state, setState, coords, setCoords, clearCoords } =
    useWeather();

  // Calculate time-based greeting (Good Morning/Afternoon/Evening)
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

  const buildCityStateQuery = (city, state) => {
    const normalizedCity = city.trim();
    const normalizedState = state.trim().toUpperCase();
    return `${encodeURIComponent(normalizedCity)},${encodeURIComponent(normalizedState)},US`;
  };

  /**
   * Fetches weather data using latitude and longitude coordinates.
   * Updates the weather state and syncs location data with the context.
   */
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

  const fetchCoordsByCityState = async (city, state) => {
    const query = buildCityStateQuery(city, state);
    const preferredState = state.trim().toUpperCase();
    const preferredStateFullName = STATE_FULL_NAME_BY_CODE[preferredState]
      ? STATE_FULL_NAME_BY_CODE[preferredState].toUpperCase()
      : "";

    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`,
    );
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Location not found");
    }

    const normalizedCity = city.trim().toLowerCase();

    const candidates = data.filter((loc) => {
      if (loc.country !== "US" || !loc.state) return false;
      const locState = loc.state.trim().toUpperCase();
      if (locState !== preferredState && locState !== preferredStateFullName) {
        return false;
      }

      const locName = loc.name?.trim().toLowerCase();
      const altName = loc.local_names?.en?.trim().toLowerCase();
      return locName === normalizedCity || altName === normalizedCity;
    });

    if (candidates.length === 0) {
      throw new Error("Location not found");
    }

    const bestMatch = candidates[0];

    setCity(bestMatch.name);
    return { lat: bestMatch.lat, lon: bestMatch.lon };
  };

  /**
   * Fetches weather data using city and state search query.
   * Clears coordinates to indicate manual city search over geolocation.
   */
  const fetchByCityState = async () => {
    if (!city || !state) {
      setError("Please enter a city and select a state.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      clearCoords();
      const coords = await fetchCoordsByCityState(city, state);
      await fetchByCoords(coords.lat, coords.lon);
    } catch (err) {
      console.error(err);
      setError("City not found. Please try again.");
      setWeather(null);
      setLoading(false);
    }
  };

  // Initial weather fetch on component mount - prioritizes coordinates over city/state
  useEffect(() => {
    if (coords) {
      fetchByCoords(coords.lat, coords.lon);
    } else if (city && state) {
      fetchByCityState();
    }
  }, []); // Run once on mount

  /**
   * Handles geolocation request to get user's current position.
   * Falls back gracefully if geolocation is not supported.
   */
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

  /**
   * Determines the background gradient based on current weather conditions.
   * Falls back to default clear sky gradient if condition is unrecognized.
   */
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

  // Create a label based on the weather
  const getWeatherRecommendation = () => {
    if (!weather) return "";
    const condition = weather.weather[0].main;
    if (condition === "Rain" || condition === "Thunderstorm")
      return "Don't forget your umbrella!";
    if (condition === "Snow") return "Bundle up, it's snowing!";
    if (condition === "Clear") return "Sunny day!";
    if (condition === "Clouds") return "Might want a light jacket.";
    return "Check the weather before heading out!";
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
        <button
          onClick={fetchByCityState}
          className="custom-btn"
          id="search-btn"
        >
          Search
        </button>
        <button onClick={handleUseMyLocation} className="custom-btn">
          <img src="../images/location-vector.svg" id="location-icon"></img>
        </button>
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
            <>
              <img
                id="weather-img"
                alt="Weather icon"
                src={getWeatherImage()}
              />
              <p id="weather-recommendation">{getWeatherRecommendation()}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
