import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api";

export default function Register() {
  const [formData, setForm] = useState({ name: "", email: "", password: "" });

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      toast.success("Registered! Check email for OTP.");
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration failed");
    }
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title>Register</Card.Title>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control value={formData.name}
              onChange={(e)=>setForm({...formData, name: e.target.value})} required/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={formData.email}
              onChange={(e)=>setForm({...formData, email: e.target.value})} required/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={formData.password}
              onChange={(e)=>setForm({...formData, password: e.target.value})} required/>
          </Form.Group>
          <Button type="submit">Register</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
