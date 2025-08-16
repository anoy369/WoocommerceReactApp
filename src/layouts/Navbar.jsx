import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineAccountCircle, MdShoppingCart } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FaBars, FaTimes } from 'react-icons/fa';
import { AiOutlineShop } from "react-icons/ai";

import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';

const NavBar = ({ cartItem = [], isAuthenticated, setUserLogout }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => {
    setExpanded(false); // Collapse mobile menu
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const stored = localStorage.getItem('user_data');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const userData = getUserData();
  const userName = userData?.name || "User";
  const firstLetter = userName.trim().charAt(0).toUpperCase();

  return (
    <Navbar
      bg="white"
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      className="shadow-sm sticky-top border-bottom"
      style={{
        fontFamily: "'Poppins', sans-serif",
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Container fluid="lg">
        {/* Brand Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          onClick={handleLinkClick}
          className="d-flex align-items-center gap-2 fw-bold fs-3 text-primary"
          style={{ letterSpacing: '0.5px' }}
        >
          <span style={{ fontSize: '1.8rem' }}><AiOutlineShop /></span>
          <span className="d-none d-sm-inline">MyStore</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(!expanded)}
          className="border-0 shadow-none"
        >
          {expanded ? (
            <FaTimes size={24} className="text-primary" />
          ) : (
            <FaBars size={24} className="text-primary" />
          )}
        </Navbar.Toggle>

        {/* Navbar Collapse */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto d-lg-flex align-items-lg-center gap-1 gap-lg-4">
            {[
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/products' },
            ].map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                onClick={handleLinkClick}
                className={`nav-link-custom d-block text-center d-lg-inline text-lg-start ${
                  location.pathname === item.path
                    ? 'fw-bold text-primary'
                    : 'fw-medium text-dark'
                }`}
                style={{
                  transition: 'color 0.2s ease',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                }}
              >
                {item.name}
              </Nav.Link>
            ))}
          </Nav>

          {/* Right Section: Cart & User */}
          <Nav className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <Nav.Link
              as={Link}
              to="/cart"
              onClick={handleLinkClick}
              className="position-relative text-dark d-flex align-items-center"
              style={{ fontSize: '1.2rem', padding: '0.5rem' }}
            >
              <MdShoppingCart size={22} />
              {cartItem.length > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.75rem', padding: '0.35em 0.5em' }}
                >
                  {cartItem.length}
                </Badge>
              )}
            </Nav.Link>

            {/* User Dropdown or Login */}
            {isAuthenticated ? (
              <Dropdown align="end" onToggle={handleLinkClick}>
                <Dropdown.Toggle
                  variant="transparent"
                  id="user-dropdown"
                  className="d-flex align-items-center gap-2 bg-transparent border-0 p-0 shadow-none"
                  style={{ minWidth: 'auto' }}
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {firstLetter}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="shadow-lg border-0 mt-2"
                  style={{
                    minWidth: '220px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <div className="px-3 py-2 bg-primary text-white">
                    <small className="text-white-50">Signed in as</small>
                    <div className="fw-bold">{userName}</div>
                  </div>
                  <Dropdown.Divider className="my-0" />
                  <Dropdown.Item
                    as={Link}
                    to="/my-account"
                    onClick={handleLinkClick}
                    className="py-3 d-flex align-items-center"
                  >
                    <MdOutlineAccountCircle size={18} className="me-3 text-primary" />
                    My Account
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/my-orders"
                    onClick={handleLinkClick}
                    className="py-3 d-flex align-items-center"
                  >
                    <MdShoppingCart size={18} className="me-3 text-success" />
                    My Orders
                  </Dropdown.Item>
                  <Dropdown.Divider className="my-0" />
                  <Dropdown.Item
                    onClick={() => {
                      setUserLogout();
                      handleLinkClick();
                    }}
                    className="py-3 text-danger d-flex align-items-center"
                  >
                    <FiLogOut size={18} className="me-3" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                onClick={handleLinkClick}
                className="fw-semibold text-primary d-flex align-items-center"
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid #0d6efd',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                Login / Sign Up
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;