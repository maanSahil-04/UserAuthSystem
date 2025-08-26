import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await API.post("/auth/verify-otp", { email, otp });
      toast.success("Email verified! You can login now.");
    } catch (e) {
      toast.error(e.response?.data?.message || "Verification failed");
    }
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title>Verify OTP</Card.Title>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email}
              onChange={(e)=>setEmail(e.target.value)} required/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>OTP</Form.Label>
            <Form.Control value={otp}
              onChange={(e)=>setOtp(e.target.value)} required/>
          </Form.Group>
          <Button type="submit">Verify</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
