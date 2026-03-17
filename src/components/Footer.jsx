import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer id="footer" aria-label="Site footer">
      <Link className="link" to="/">Droplet</Link>
      <div>
        <p aria-hidden="true">|</p>
      </div>
      <nav id="footer-links" aria-label="Footer Navigation">
        <Link className="link" to="/">Home</Link>
        <Link className="link" to="/quotes">Quotes</Link>
        <Link className="link" to="/about">About</Link>
        <p aria-hidden="true">|</p>
      </nav>
      <div>Wilber Amaya-Maurisio and Christian Velez &#169; {currentYear}</div>
    </footer>
  );
}
export default Footer;
