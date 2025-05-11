import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";
import "./styles.css";

const BlogItem = ({ title, cover, author, _id }) => {
  const defaultCover = "https://placehold.co/600x400?text=Nessuna+Copertina";

  return (
    <Card className="blog-card">
      <Card.Img
        variant="top"
        src={cover || defaultCover}
        className="blog-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultCover;
        }}
      />
      <Card.Body>
        <Card.Title>
          <Link to={`/blog/${_id}`} className="blog-link-title">
            {title}
          </Link>
        </Card.Title>
      </Card.Body>
      <Card.Footer>
        <BlogAuthor {...author} _id={author._id} />
      </Card.Footer>
    </Card>
  );
};

export default BlogItem;