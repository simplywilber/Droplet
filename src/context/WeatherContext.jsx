import { createContext, useContext, useState, useEffect } from "react";

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

/**
 * WeatherProvider component that manages weather-related state across the application.
 * Uses sessionStorage to persist user location preferences and coordinates between page refreshes,
 * providing a better user experience by remembering their last searched location.
 */
export const WeatherProvider = ({ children }) => {
  // Initialize state from sessionStorage to persist user preferences across page refreshes
  const [city, setCity] = useState(sessionStorage.getItem("weatherCity") || "");
  const [state, setState] = useState(
    sessionStorage.getItem("weatherState") || "WA",
  );
  const [coords, setCoords] = useState(() => {
    const saved = sessionStorage.getItem("weatherCoords");
    return saved ? JSON.parse(saved) : null;
  });

  // Sync state changes to sessionStorage for persistence
  useEffect(() => {
    sessionStorage.setItem("weatherCity", city);
  }, [city]);

  useEffect(() => {
    sessionStorage.setItem("weatherState", state);
  }, [state]);

  useEffect(() => {
    if (coords) {
      sessionStorage.setItem("weatherCoords", JSON.stringify(coords));
    } else {
      sessionStorage.removeItem("weatherCoords");
    }
  }, [coords]);

  const clearCoords = () => setCoords(null);

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        state,
        setState,
        coords,
        setCoords,
        clearCoords,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );

  return (
    <WeatherContext.Provider
      value={{
        city,
        setCity,
        state,
        setState,
        coords,
        setCoords,
        clearCoords,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
