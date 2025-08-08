import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // username o email
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); // oppure navigate("/me") se vuoi portare al profilo
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        alert(data.error || "Errore nel login");
      }
    } catch (err) {
      console.error("Errore durante il login:", err);
      alert("Errore interno del server.");
    }
  };

  return (
    <Container className="mt-5 pt-5 register-container" style={{ maxWidth: "500px" }}>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email o Username</Form.Label>
          <Form.Control
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="dark">
          Accedi
        </Button>
      </Form>
    </Container>
  );
};

export default Login;