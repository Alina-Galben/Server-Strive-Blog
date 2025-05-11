import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const getToken = () => {
  return localStorage.getItem("token") || process.env.REACT_APP_TOKEN;
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [authors, setAuthors] = useState([]);
  const [showAuthors, setShowAuthors] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${process.env.REACT_APP_APYURL}/authors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAuthors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Errore nel caricamento autori:", error);
      }
    };

    fetchAuthors();
  }, []);

  const handleAuthorClick = (authorId) => {
    navigate(`/author/${authorId}/posts`);
  };

  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>

      {/* Barra di ricerca */}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col xs={9}>
            <Form.Control
              type="text"
              placeholder="Cerca per titolo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col>
            <Button type="submit" variant="dark">
              Cerca
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Bottone per mostrare/nascondere autori */}
      <div className="mb-3" style={{ textAlign: "center" }}>
        <Button variant="secondary" onClick={() => setShowAuthors(!showAuthors)}>
          {showAuthors ? "Nascondi Autori" : "Sezione Autori"}
        </Button>
      </div>

      {/* Sezione autori visibile solo se showAuthors è true */}
      {showAuthors && (
        <>
          <h3 className="mb-3">Autori</h3>
          <Row className="mb-4">
            {authors.map((author) => (
              <Col
                key={author._id} xs={6} md={4} lg={3} className="mb-3" style={{ cursor: "pointer" }}
                onClick={() => handleAuthorClick(author._id)}>
                <div
                  style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "10px",
                    textAlign: "center",
                  }}>
                  <img src={author.avatar} alt={`${author.nome} ${author.cognome}`}
                       style={{ width: "100px", borderRadius: "50%" }}
                  />
                  <h6 className="mt-2">
                    {author.nome} {author.cognome}
                  </h6>
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Lista dei blog post filtrati */}
      <BlogList search={searchTerm} />
    </Container>
  );
};

export default Home;
