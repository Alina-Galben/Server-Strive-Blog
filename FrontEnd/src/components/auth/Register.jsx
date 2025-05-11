import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    username: "",
    email: "",
    dataDiNascita: "",
    avatar: null,
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_APYURL}/auth/register`, {
        method: "POST",
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        alert("Registrazione completata! Ora puoi accedere.");
        navigate("/login");
      } else {
        alert(result.error || "Errore durante la registrazione.");
      }
    } catch (err) {
      console.error("Errore nella registrazione:", err);
      alert("Errore interno del server.");
    }
  };

  return (
    <Container className="mt-5 pt-5 register-container" style={{ maxWidth: "600px" }}>
      <h2>Registrazione</h2>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" name="nome" required onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cognome</Form.Label>
          <Form.Control type="text" name="cognome" required onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" required onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" required onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Data di nascita</Form.Label>
          <Form.Control type="date" name="dataDiNascita" required onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <Form.Control type="file" name="avatar" accept="image/*" required onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" required onChange={handleChange} />
        </Form.Group>
        <Button type="submit" variant="dark">Registrati</Button>
      </Form>
    </Container>
  );
};

export default Register;
