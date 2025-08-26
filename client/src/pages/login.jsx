import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      toast.success("Logged in!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Login failed");
    }
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title>Login</Card.Title>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={form.email}
              onChange={(e)=>setForm({...form, email: e.target.value})} required/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={form.password}
              onChange={(e)=>setForm({...form, password: e.target.value})} required/>
          </Form.Group>
          <Button type="submit">Login</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
