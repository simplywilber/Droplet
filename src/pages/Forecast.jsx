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

function Forecast() {
  const { city, setCity, state, setState, coords, setCoords, clearCoords } = useWeather();
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const buildCityStateQuery = (city, state) => {
    const normalizedCity = city.trim();
    const normalizedState = state.trim().toUpperCase();
    return `${encodeURIComponent(normalizedCity)},${encodeURIComponent(normalizedState)},US`;
  };

  // Get coordinates from city/state via geocoding endpoint (US state enforced)
  const fetchCoords = async () => {
    try {
      setLoading(true);
      setError("");

      const query = buildCityStateQuery(city, state);
      const preferredState = state.trim().toUpperCase();
      const preferredStateFullName = STATE_FULL_NAME_BY_CODE[preferredState]
        ? STATE_FULL_NAME_BY_CODE[preferredState].toUpperCase()
        : "";
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`,
      );

      const data = await res.json();
      console.log("Coords response:", data);

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
    } catch (err) {
      console.error(err);
      setError("City not found. Please try again.");
      setLoading(false);
      return null;
    }
  };

  // Fetch 5-day forecast (free API)
  const fetchForecast = async () => {
    let currentCoords = coords;
    
    if (!currentCoords) {
      currentCoords = await fetchCoords();
      if (!currentCoords) return;
      clearCoords(); // Just to be consistent, though fetchCoords is city-based
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${currentCoords.lat}&lon=${currentCoords.lon}&units=imperial&appid=${API_KEY}`,
      );

      const data = await res.json();
      console.log("Forecast response:", data);

      if (!data.list) throw new Error("Invalid forecast data");

      // Grab one data point per day (~every 24 hrs)
      const dailyData = data.list.filter((_, index) => index % 8 === 0);

      setForecast(dailyData.slice(0, 5));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch forecast. Try again.");
      setLoading(false);
    }
  };

  const handleFetchForecast = async () => {
    clearCoords();
    await fetchForecast();
  };

  useEffect(() => {
    if (coords || (city && state)) {
      fetchForecast();
    }
  }, []);

  // Use geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`,
          );

          const data = await res.json();
          console.log("Geo forecast:", data);

          if (!data.list) throw new Error("Invalid forecast data");

          setCity(data.city.name);
          const dailyData = data.list.filter((_, index) => index % 8 === 0);

          setForecast(dailyData.slice(0, 5));
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch forecast from your location.");
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location.");
        setLoading(false);
      },
    );
  };

  const getDayName = (dt) => {
    return new Date(dt * 1000).toLocaleDateString(undefined, {
      weekday: "long",
    });
  };

  return (
    <div
      id="container-home"
      style={{ flexDirection: "column", padding: "25px" }}
    >
      <h1>Weekly Forecast</h1>

      {/* Inputs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
<input
  type="text"
  placeholder="City"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleFetchForecast()}
/>

        <select value={state} onChange={(e) => setState(e.target.value)}>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button onClick={handleFetchForecast} className="custom-btn-forecast">Search</button>
        <button onClick={handleUseMyLocation} className="custom-btn-forecast">Use My Location</button>
      </div>

      {/* Status */}
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading forecast...</p>}

      {/* Forecast Cards */}
      <div
        id="flex-cards-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {forecast.map((day) => (
          <div key={day.dt} class="forecast-card">
            <h3>{getDayName(day.dt)}</h3>

            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />

            <p>{day.weather[0].main}</p>
            <p>{Math.round(day.main.temp)}°F</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
