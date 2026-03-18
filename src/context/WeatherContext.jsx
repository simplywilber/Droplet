import { createContext, useContext, useState, useEffect } from "react";

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState(sessionStorage.getItem("weatherCity") || "");
  const [state, setState] = useState(
    sessionStorage.getItem("weatherState") || "WA",
  );
  const [coords, setCoords] = useState(() => {
    const saved = sessionStorage.getItem("weatherCoords");
    return saved ? JSON.parse(saved) : null;
  });

  // Keep sessionStorage in sync
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
};
