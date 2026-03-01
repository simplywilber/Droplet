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
        <Link class="link">Home</Link>
        <Link class="link">Fortunes</Link>
        <Link class="link">About</Link>
        <p>|</p>
      </div>
      <div>
        &#169; {currentYear}
      </div>
    </footer>
  );
}
export default Footer;
