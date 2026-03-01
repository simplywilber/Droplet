import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav id="nav-bar">
      <div id="logo">
        <Link class="link" to="/">Droplet</Link>
      </div>
      <div class="nav-links">
        <Link class="link" to="/">Home</Link>
        <Link class="link" to="/fortunes">Fortunes</Link>
        <Link class="link" to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
