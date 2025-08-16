import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form, Alert } from "react-bootstrap";
import { FiUser, FiMail, FiMapPin, FiEdit2, FiCheck, FiX, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { toast } from "react-toastify";
import md5 from "md5";

const MyAccount = ({ loggedInUserData }) => {
  const navigate = useNavigate();

  // Dark Mode State (from localStorage)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Parse user data safely
  const initialUserData =
    typeof loggedInUserData === "string"
      ? JSON.parse(loggedInUserData)
      : loggedInUserData || {};

  const [user, setUser] = useState({
    name: initialUserData.name || "",
    email: initialUserData.email || "",
    username: initialUserData.username || "",
    billing: initialUserData.billing || {},
    shipping: initialUserData.shipping || {},
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("orderItems");
    navigate("/login");
    toast.info("You've been logged out.");
  };

  const toggleEdit = () => {
    setEditForm({ ...user });
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save to WordPress via custom REST API
  const saveToWordPress = async (userData) => {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Not logged in");

    const response = await fetch(
      "https://woocommerceapp.anoy369.com/wp-json/myapi/v1/update-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
        }),
      }
    );

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to update profile");
    }
    return result;
  };

  const handleSave = () => {
    saveToWordPress(editForm)
      .then(() => {
        setUser({ ...editForm });
        const updatedUserData = { ...initialUserData, ...editForm };
        localStorage.setItem("user_data", JSON.stringify(updatedUserData));
        toast.success("Profile updated!");
      })
      .catch((err) => {
        toast.error(err.message || "Could not save changes.");
      })
      .finally(() => {
        setIsEditing(false);
      });
  };

  if (!initialUserData || Object.keys(initialUserData).length === 0) {
    return (
      <Container className="my-5 text-center">
        <h4 className="text-muted">Not Logged In</h4>
        <p className="text-secondary">Please log in to view your account.</p>
        <Button variant="primary" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </Container>
    );
  }

  // Gravatar URL
  const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
    user.email.trim().toLowerCase()
  )}?s=200&d=identicon`;

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: darkMode ? "#fff" : "#212529" }}>
          <FiUser className="me-2" /> My Account
        </h2>
        <div className="d-flex gap-2">
          <Button
            variant={darkMode ? "outline-light" : "outline-primary"}
            size="sm"
            onClick={toggleDarkMode}
            className="d-flex align-items-center"
          >
            {darkMode ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}{" "}
            <span className="ms-1">{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Profile Header */}
          <Card
            className="shadow-sm border-0 rounded-4 mb-4 text-center"
            style={{
              backgroundColor: darkMode ? "#2d3748" : "white",
              color: darkMode ? "white" : "black",
            }}
          >
            <Card.Body className="p-5">
              <div
                className="rounded-circle mx-auto mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  overflow: "hidden",
                  border: "4px solid #0d6efd",
                }}
              >
                <img
                  src={gravatarUrl}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h4 style={{ color: darkMode ? "white" : "black" }}>{user.name || user.username}</h4>
              <p className="text-muted">{user.email}</p>
            </Card.Body>
          </Card>

          {/* Edit Info */}
          <Card
            className="shadow-sm border-0 rounded-4 mb-4"
            style={{
              backgroundColor: darkMode ? "#2d3748" : "white",
              color: darkMode ? "white" : "black",
            }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center">
                  <FiUser className="me-2" style={{ color: "#0d6efd" }} /> Personal Information
                </h5>
                {!isEditing ? (
                  <Button variant="outline-primary" size="sm" onClick={toggleEdit}>
                    <FiEdit2 /> Edit
                  </Button>
                ) : (
                  <div>
                    <Button variant="secondary" size="sm" onClick={toggleEdit} className="me-2">
                      <FiX /> Cancel
                    </Button>
                    <Button variant="success" size="sm" onClick={handleSave}>
                      <FiCheck /> Save
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      style={{
                        backgroundColor: darkMode ? "#4a5568" : "white",
                        color: darkMode ? "white" : "black",
                        borderColor: darkMode ? "#4a5568" : "",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      style={{
                        backgroundColor: darkMode ? "#4a5568" : "white",
                        color: darkMode ? "white" : "black",
                        borderColor: darkMode ? "#4a5568" : "",
                      }}
                    />
                  </Form.Group>
                </Form>
              ) : (
                <div className="mt-3">
                  <div
                    className="p-3 rounded mb-2"
                    style={{
                      backgroundColor: darkMode ? "#4a5568" : "#f8f9fa",
                    }}
                  >
                    <strong>Name:</strong>{" "}
                    <span style={{ color: darkMode ? "#e2e8f0" : "#495057" }}>
                      {user.name || "Not set"}
                    </span>
                  </div>
                  <div
                    className="p-3 rounded"
                    style={{
                      backgroundColor: darkMode ? "#4a5568" : "#f8f9fa",
                    }}
                  >
                    <strong>Email:</strong>{" "}
                    <span style={{ color: darkMode ? "#e2e8f0" : "#495057" }}>{user.email}</span>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Billing Address */}
          <Card
            className="shadow-sm border-0 rounded-4 mb-4"
            style={{
              backgroundColor: darkMode ? "#2d3748" : "white",
              color: darkMode ? "white" : "black",
            }}
          >
            <Card.Body className="p-4">
              <h5 className="mb-4 d-flex align-items-center">
                <FiMapPin className="me-2" style={{ color: "#0d6efd" }} /> Billing Address
              </h5>
              {user.billing?.first_name || user.billing?.address_1 ? (
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: darkMode ? "#4a5568" : "#f8f9fa",
                  }}
                >
                  <p className="mb-1">
                    {user.billing.first_name} {user.billing.last_name}
                  </p>
                  <p className="mb-1">{user.billing.address_1}</p>
                  {user.billing.address_2 && <p className="mb-1">{user.billing.address_2}</p>}
                  <p className="mb-1">
                    {user.billing.city}, {user.billing.state} {user.billing.postcode}
                  </p>
                  <p className="mb-1">{user.billing.country}</p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {user.billing.phone || "Not provided"}
                  </p>
                </div>
              ) : (
                <Alert variant="info" className="py-2">
                  No billing address set.
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Shipping Address */}
          <Card
            className="shadow-sm border-0 rounded-4 mb-4"
            style={{
              backgroundColor: darkMode ? "#2d3748" : "white",
              color: darkMode ? "white" : "black",
            }}
          >
            <Card.Body className="p-4">
              <h5 className="mb-4 d-flex align-items-center">
                <FiMapPin className="me-2" style={{ color: "#0d6efd" }} /> Shipping Address
              </h5>
              {user.shipping?.first_name || user.shipping?.address_1 ? (
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: darkMode ? "#4a5568" : "#f8f9fa",
                  }}
                >
                  <p className="mb-1">
                    {user.shipping.first_name} {user.shipping.last_name}
                  </p>
                  <p className="mb-1">{user.shipping.address_1}</p>
                  {user.shipping.address_2 && <p className="mb-1">{user.shipping.address_2}</p>}
                  <p className="mb-1">
                    {user.shipping.city}, {user.shipping.state} {user.shipping.postcode}
                  </p>
                  <p className="mb-1">{user.shipping.country}</p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {user.shipping.phone || "Not provided"}
                  </p>
                </div>
              ) : (
                <Alert variant="info" className="py-2">
                  No shipping address set.
                </Alert>
              )}
            </Card.Body>
          </Card>

          {/* Quick Links */}
          <div className="text-center mt-4">
            <Button
              variant={darkMode ? "outline-light" : "outline-primary"}
              className="me-3"
              onClick={() => navigate("/my-orders")}
            >
              View Orders
            </Button>
            <Button
              variant={darkMode ? "outline-light" : "outline-secondary"}
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MyAccount;