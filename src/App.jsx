import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Fortunes from "./pages/Fortunes";
import About from "./pages/About";
import AuthForm from "./components/AuthForm";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  // to avoid flash of routes
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {user ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fortunes" element={<Fortunes />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <AuthForm />
      )}
    </>
  );
}

export default App;