import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Quotes from "./pages/Quotes"
import About from "./pages/About";
import AuthForm from "./components/AuthForm";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div id="loading-text"><p>Loading...</p></div>;

  return (
    <>
      {user ? (
        <>
          <Navbar />
          <main className="main-content">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
        </>
      ) : (
        <AuthForm />
      )}
    </>
  );
}

export default App;
