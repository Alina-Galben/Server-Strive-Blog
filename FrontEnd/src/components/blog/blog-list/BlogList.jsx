import React, { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const getToken = () => {
  return localStorage.getItem("token") || process.env.REACT_APP_TOKEN;
};

const BlogList = ({ search }) => {
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const queryTitle = search ? `&title=${encodeURIComponent(search)}` : "";

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/blogPost?size=${PAGE_SIZE}&page=${page}${queryTitle}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const newPosts = Array.isArray(data) ? data : [];

        if (page === 1) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => [...prev, ...newPosts]);
        }

        setHasMore(newPosts.length === PAGE_SIZE);
      } catch (error) {
        console.error("Errore nel caricamento dei post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, search]);

  // Quando cambia la ricerca, resetta la pagina a 1
  useEffect(() => {
    setPage(1);
  }, [search]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };


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
              <Button variant="dark" onClick={loadMore}>
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
