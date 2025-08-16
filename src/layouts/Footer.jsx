import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          {/* Brand Column */}
          <div className="col-md-4 mb-4">
            <h5 className="text-dark" >StyleHub</h5>
            <p className="small text-muted">
              Premium clothing for the modern lifestyle. Quality, comfort, and timeless design.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-3 text-center">
              <Link to="#" className="text-dark fs-5">
                <FaFacebook />
              </Link>
              <Link to="#" className="text-dark fs-5">
                <FaInstagram />
              </Link>
              <Link to="#" className="text-dark fs-5">
                <FaTwitter />
              </Link>
              <Link to="#" className="text-dark fs-5">
                <FaYoutube />
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase text-dark mb-3">Shop</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/products" className="text-muted text-decoration-none small">
                  All Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?featured=true" className="text-muted text-decoration-none small">
                  Featured
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?on_sale=true" className="text-muted text-decoration-none small">
                  Sale
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-muted text-decoration-none small">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase text-dark mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none small">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-muted text-decoration-none small">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping" className="text-muted text-decoration-none small">
                  Shipping
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/returns" className="text-muted text-decoration-none small">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h6 className="text-uppercase mb-3 text-dark">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none small">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/blog" className="text-muted text-decoration-none small">
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/careers" className="text-muted text-decoration-none small">
                  Careers
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-muted text-decoration-none small">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & Trust */}
          <div className="col-md-2">
            <h6 className="text-uppercase text-dark mb-3">We Accept</h6>
            <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mt-2">
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((method) => (
                <span
                  key={method}
                  className="badge bg-dark text-white px-2 py-1"
                  style={{ fontSize: "0.7rem", borderRadius: "4px" }}
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="mt-3 small text-muted">
              Secure payments with industry-leading encryption.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="my-4 text-dark" />
        <div className="text-center small text-muted">
          &copy; {new Date().getFullYear()} StyleHub. All rights reserved.
          <br />
          Designed with by{" "}
          <Link to="https://anoy369.com" className="text-dark text-decoration-none">
            anoy369
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;