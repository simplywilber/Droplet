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

function Forecast() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("WA");
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Get coordinates from city/state
  const fetchCoords = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},US&appid=${API_KEY}`,
      );

      const data = await res.json();
      console.log("Coords response:", data);

      if (data.cod !== 200) throw new Error(data.message);

      return { lat: data.coord.lat, lon: data.coord.lon };
    } catch (err) {
      console.error(err);
      setError("City not found. Please try again.");
      setLoading(false);
      return null;
    }
  };

  // Fetch 5-day forecast (free API)
  const fetchForecast = async () => {
    const coords = await fetchCoords();
    if (!coords) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=imperial&appid=${API_KEY}`,
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

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`,
          );

          const data = await res.json();
          console.log("Geo forecast:", data);

          if (!data.list) throw new Error("Invalid forecast data");

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
        />

        <select value={state} onChange={(e) => setState(e.target.value)}>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button onClick={fetchForecast}>Search</button>
        <button onClick={handleUseMyLocation}>Use My Location</button>
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
