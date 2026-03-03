import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer id="footer">
      <Link class="link">Droplet</Link>
      <div>
        <p>|</p>
      </div>
      <div id="footer-links">
        <Link className="link">Home</Link>
        <Link className="link">Fortunes</Link>
        <Link className="link">About</Link>
        <p>|</p>
      </div>
      <div>Wilber Amaya-Maurisio and Christian Velez &#169; {currentYear}</div>
    </footer>
  );
}
export default Footer;
