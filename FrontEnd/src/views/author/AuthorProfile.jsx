import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";

const getToken = () =>
  localStorage.getItem("token") || process.env.REACT_APP_TOKEN;

const AuthorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAuthor = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_APYURL}/authors/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        navigate("/404");
        return;
      }

      const data = await res.json();
      setAuthor(data);
    } catch (err) {
      console.error("Errore caricamento autore:", err);
      navigate("/404");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, [id]);

  if (loading) {
    return (
      <Container className="pt-5 mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!author) {
    return (
      <Container className="pt-5 mt-5 text-center">
        <h4>Autore non trovato.</h4>
      </Container>
    );
  }

  const { nome, cognome, username, email, dataDiNascita, avatar } = author;

  return (
    <Container className="pt-5 mt-5">
      <Card style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Card.Img
          variant="top"
          src={avatar}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x300?text=Avatar";
          }}
        />
        <Card.Body>
          <Card.Title>{`${nome} ${cognome}`}</Card.Title>
          <Card.Text>
            <strong>Username:</strong> {username} <br />
            <strong>Email:</strong> {email} <br />
            <strong>Data di nascita:</strong> {dataDiNascita}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthorProfile;