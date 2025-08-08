import React, { useEffect, useState } from "react";
import { Container, Image, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import CommentArea from "../../components/comments/CommentArea";
import "./styles.css";

// Recupero token
const getToken = () => {
  return localStorage.getItem("token") || process.env.REACT_APP_TOKEN;
};

const Blog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPost/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          navigate("/404");
          return;
        }

        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error("Errore nel caricamento del blog:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Caricamento...</div>;
  }

  if (!blog) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <h4>Post non trovato.</h4>
              <button className="back-button" onClick={() => navigate("/")}>Torna alla Home</button>
            </div>
  }

  const { title, cover, content, author, createdAt, readTime } = blog;
  const defaultCover = "https://placehold.co/600x400?text=Nessuna+Copertina";

  return (
    <div className="blog-details-root">
      <Container>
        <Image
          className="blog-details-cover mb-4"
          src={cover || defaultCover}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultCover;
          }}
          fluid
        />

        <h1 className="blog-details-title">{title}</h1>

        <Row className="blog-details-container my-4">
          <Col md={6}>
            {author && typeof author === "object" && (
              <BlogAuthor {...author} />
            )}
          </Col>
          <Col md={6} className="text-md-end">
            <div>{new Date(createdAt).toLocaleDateString()}</div>
            <div>{`Tempo di lettura: ${readTime?.value || 0} ${readTime?.unit || "minuti"}`}</div>
            <div style={{ marginTop: "10px" }}>
              <BlogLike defaultLikes={["123"]} onChange={() => {}} />
            </div>
          </Col>
        </Row>
        
        {/* ...copertina, titolo, autore, contenuto... */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* SEZIONE COMMENTI */}
        <CommentArea postId={id} />
      </Container>
    </div>
  );
};

export default Blog;
