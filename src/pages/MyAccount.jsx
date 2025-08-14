// pages/MyAccount.js
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { FiLogOut, FiUser, FiMail, FiUserCheck } from "react-icons/fi";

const MyAccount = ({ loggedInUserData }) => {
  const navigate = useNavigate();

  // Safely parse or use object
  const userData =
    typeof loggedInUserData === "string"
      ? JSON.parse(loggedInUserData)
      : loggedInUserData || {};

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    localStorage.removeItem("orderItems");
    navigate("/login");
  };

  if (!userData || Object.keys(userData).length === 0) {
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

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">
          <FiUser className="me-2" /> My Account
        </h2>
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          <FiLogOut className="me-1" /> Logout
        </Button>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#0d6efd",
                    color: "white",
                    fontSize: "2rem",
                  }}
                >
                  {userData.name?.charAt(0).toUpperCase() || userData.username?.charAt(0).toUpperCase()}
                </div>
                <h4 className="mt-3 mb-1">{userData.name || userData.username}</h4>
                <p className="text-muted">{userData.email}</p>
              </div>

              <hr />

              <div className="mt-4">
                <h6><FiUserCheck className="me-2 text-primary" /> Account Info</h6>
                <div className="border rounded p-3 bg-light mb-3">
                  <div className="d-flex align-items-center mb-3">
                    <FiUser className="text-primary me-3" size={18} />
                    <div>
                      <small className="text-muted">Name</small>
                      <p className="mb-0 fw-medium">{userData.name || "Not set"}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <FiMail className="text-primary me-3" size={18} />
                    <div>
                      <small className="text-muted">Email</small>
                      <p className="mb-0 fw-medium">{userData.email}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <FiUser className="text-primary me-3" size={18} />
                    <div>
                      <small className="text-muted">Username</small>
                      <p className="mb-0 fw-medium">{userData.username}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional: Add "Edit Profile" or "My Orders" */}
              <div className="d-grid gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/my-orders")}
                >
                  View My Orders
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyAccount;