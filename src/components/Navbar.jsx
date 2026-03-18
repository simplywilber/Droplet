import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();

  // Handles user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
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
        <div className="nav-links">
          <Link className="link" to="/">
            Home
          </Link>
          <Link className="link" to="/quotes">
            Quotes
          </Link>
          <Link className="link" to="/forecast">
            Forecast
          </Link>
          <Link className="link" to="/about">
            About
          </Link>
          {user && (
            <span className="user-email" aria-label="Logged in user email">
              {user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="link"
            class="custom-btn"
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
