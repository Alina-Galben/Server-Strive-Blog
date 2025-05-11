import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import BlogItem from "../../components/blog/blog-item/BlogItem";

// Recupera il token da localStorage o da .env
const getToken = () => {
  return localStorage.getItem("token") || process.env.REACT_APP_TOKEN;
};

const AuthorPosts = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      try {
        const token = getToken();

        const res = await fetch(`${process.env.REACT_APP_APYURL}/authors/${id}/blogPosts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Errore nel caricamento dei post dell'autore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorPosts();
  }, [id]);

  return (
    <Container>
      <h2 className="my-4">Post dell'autore</h2>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>Caricamento...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>Nessun post trovato per questo autore.</div>
      ) : (
        <Row>
          {posts.map((post, i) => (
            <Col key={`post-${i}`} md={4} style={{ marginBottom: 50 }}>
              <BlogItem {...post} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default AuthorPosts;