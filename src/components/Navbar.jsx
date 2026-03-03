import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav id="nav-bar">
      <div id="logo">
        <Link className="link" id="logo-text" to="/">Droplet</Link>
      </div>
      <div class="nav-links">
        <Link className="link" to="/">Home</Link>
        <Link className="link" to="/fortunes">Fortunes</Link>
        <Link className="link" to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
