import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handles user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav id="nav-bar" aria-label="Main Navigation">
        <div id="logo">
          <Link
            className="link"
            id="logo-text"
            to="/"
            aria-label="Droplet Home"
          >
            Droplet
          </Link>
        </div>

        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link className="link" to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link className="link" to="/quotes" onClick={() => setIsMenuOpen(false)}>
            Quotes
          </Link>
          <Link className="link" to="/forecast" onClick={() => setIsMenuOpen(false)}>
            Forecast
          </Link>
          <Link className="link" to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          {user && (
            <span className="user-email" aria-label="Logged in user email">
              {user.email}
            </span>
          )}
          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="link custom-btn"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
