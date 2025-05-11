import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const getToken = () => {
  return localStorage.getItem("token") || process.env.REACT_APP_TOKEN;
};

const BlogList = ({ search }) => {
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  // Fetch blog post con paginazione
  const fetchPosts = async (reset = false) => {
    try {
      setLoading(true);
      const token = getToken();
      const queryTitle = search ? `&title=${encodeURIComponent(search)}` : "";
      const pageToFetch = reset ? 1 : page;

      const res = await fetch(
        `${process.env.REACT_APP_APYURL}/blogPost?size=${PAGE_SIZE}&page=${pageToFetch}${queryTitle}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const newPosts = Array.isArray(data) ? data : [];

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      // Se ricevi meno di PAGE_SIZE, non ci sono altri post
      setHasMore(newPosts.length === PAGE_SIZE);
      if (!reset) setPage((prev) => prev + 1);
      if (reset) setPage(2);
    } catch (error) {
      console.error("Errore nel caricamento dei post:", error);
    } finally {
      setLoading(false);
    }
  };

  // Caricamento iniziale e su ricerca
  useEffect(() => {
    fetchPosts(true);
  }, [search]);

  // Fetch autori
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
        console.error("Errore nel caricamento degli autori:", error);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <>
      <h3 className="mb-3">Blog Post</h3>

      {loading && posts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h5>Caricamento...</h5>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h5>Nessun post trovato.</h5>
        </div>
      ) : (
        <>
          <Row>
            {posts.map((post, i) => (
              <Col key={`item-${i}`} md={4} style={{ marginBottom: 50 }}>
                <BlogItem {...post} />
              </Col>
            ))}
          </Row>

          {hasMore && (
            <div style={{ textAlign: "center" }}>
              <Button variant="dark" onClick={() => fetchPosts()}>
                Vedi altri
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default BlogList;
