import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Navbar() {
  // Handles user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };
  return (
    <nav id="nav-bar">
      <div id="logo">
        <Link className="link" id="logo-text" to="/">
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
        <Link className="link" to="/about">
          About
        </Link>
        <Link onClick={handleLogout} className="link" id="logout-btn">Logout</Link>
      </div>
    </nav>
  );
}

export default Navbar;
