import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav id="nav-bar">
      <div>
        <Link to="/" id="logo">Droplet</Link>
      </div>
      <div class="nav-links">
        <Link to="/">Home</Link>
        <Link to="/fortunes">Fortunes</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
