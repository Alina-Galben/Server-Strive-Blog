import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BlogItem from "../../components/blog/blog-item/BlogItem";

const getToken = () =>
  localStorage.getItem("token") || process.env.REACT_APP_TOKEN;

const AuthorMe = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_APYURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      setUser(data);

      const postsRes = await fetch(
        `${process.env.REACT_APP_APYURL}/authors/${data._id}/blogPosts`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const postsData = await postsRes.json();
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      console.error("Errore:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container className="pt-5 mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="pt-5 mt-5 text-center">
        <h4>Utente non trovato.</h4>
      </Container>
    );
  }

  const { nome, cognome, username, email, dataDiNascita, avatar } = user;

  return (
    <Container className="pt-5 mt-5 register-container">
      <Row>
        {/* COLONNA SINISTRA - PROFILO */}
        <Col md={4}>
          <Card className="mb-4">
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
        </Col>

        {/* COLONNA DESTRA - ARTICOLI */}
        <Col md={8}>
            <h4>I tuoi articoli pubblicati</h4>
            <Row className="mt-3">
            {posts.length > 0 ? (
                posts.map((post, i) => (
                <Col md={6} key={i} className="mb-4">
                    <BlogItem {...post} />
                </Col>
                ))
            ) : (
                <p>Non hai ancora pubblicato nessun articolo.</p>
            )}
            </Row>
        </Col>
      </Row>

    </Container>
  );
};

export default AuthorMe;