import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SavedFortunes from "./pages/Fortunes";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fortunes" element={<SavedFortunes />} />
      </Routes>
    </>
  );
}

export default App;