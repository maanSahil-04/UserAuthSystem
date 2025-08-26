import { Container, Nav, Navbar } from "react-bootstrap";
import { Route, Routes, Link } from "react-router-dom";
import Register from "./pages/register.jsx";
import VerifyOtp from "./pages/verifyOtp.jsx";
import Login from "./pages/login.jsx";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">User Auth</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/verify-otp">Verify OTP</Nav.Link>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Routes>
          <Route path="/" element={<div>Welcome 👋</div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
      <ToastContainer position="top-right" />
    </>
  );
}
