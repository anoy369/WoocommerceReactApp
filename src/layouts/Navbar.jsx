import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineAccountCircle } from "react-icons/md";
import { BsCartCheck } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Badge,
} from 'react-bootstrap';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

const NavBar = ({ cartItem = [], isAuthenticated, setUserLogout }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => {
    setExpanded(false); // Collapse navbar (mobile) after click
  };

  //Retrieve user data from localStorage
  const getUserData = () => {
    try {
      const storedUserData = localStorage.getItem('user_data');
      return storedUserData ? JSON.parse(storedUserData) : null;
    } catch (error) {
      console.error("Error retrieving user data from localStorage:", error);
      return null;
    }
  };

  // Get user data
  const userData = getUserData();
  const userName = userData?.name || "User"; // Fallback to "User" if name is missing

  // Extract first letter for avatar
  const firstLetter = userName.trim().charAt(0).toUpperCase();

  return (
    <Navbar
      bg="white"
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      className="shadow-sm sticky-top border-bottom"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-primary fs-3 d-flex align-items-center gap-2"
          onClick={handleLinkClick}
        >
          <span className="d-none d-sm-inline">MyStore</span>
        </Navbar.Brand>

        {/* Toggle Button */}
        <Navbar.Toggle
          aria-controls="navbar-nav"
          className="border-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <FaTimes size={24} className="text-dark" />
          ) : (
            <FaBars size={24} className="text-dark" />
          )}
        </Navbar.Toggle>

        {/* Navbar Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto d-flex align-items-center gap-4">
            {/* Home */}
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleLinkClick}
              className={
                location.pathname === '/'
                  ? 'fw-semibold text-primary nav-active'
                  : 'fw-medium text-dark nav-link-custom'
              }
            >
              Home
            </Nav.Link>

            {/* Products */}
            <Nav.Link
              as={Link}
              to="/products"
              onClick={handleLinkClick}
              className={
                location.pathname === '/products'
                  ? 'fw-semibold text-primary nav-active'
                  : 'fw-medium text-dark nav-link-custom'
              }
            >
              Products
            </Nav.Link>
          </Nav>

          {/* Right Side: Cart & User Avatar */}
          <Nav className="d-flex align-items-center gap-3">
            {/* Cart Icon */}
            <Nav.Link
              as={Link}
              to="/cart"
              onClick={handleLinkClick}
              className="position-relative text-dark"
            >
              <FaShoppingCart size={20} />
              {cartItem.length > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cartItem.length}
                </Badge>
              )}
            </Nav.Link>

            {/* Avatar Dropdown */}
            {isAuthenticated ? (
              <Dropdown align="end" onToggle={handleLinkClick}>
                <Dropdown.Toggle
                  variant="transparent"
                  className="d-flex align-items-center gap-2 text-dark bg-transparent border-0 p-0 shadow-none"
                  id="user-dropdown"
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                    style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}
                  >
                    {firstLetter}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow-lg border border-light">
                  <Dropdown.Header>
                    <small className="text-muted">Signed in as</small>
                    <div className="fw-bold">{userName}</div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/my-account" onClick={handleLinkClick}>
                    <MdOutlineAccountCircle /> My Account
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-orders" onClick={handleLinkClick}>
                    <BsCartCheck /> My Orders
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => {
                      setUserLogout();
                      handleLinkClick();
                    }}
                    className="text-danger"
                  >
                    <FiLogOut /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                onClick={handleLinkClick}
                className="fw-semibold text-primary"
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