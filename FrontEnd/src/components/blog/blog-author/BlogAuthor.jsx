import React from "react";
import { Col, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles.css";

const BlogAuthor = ({ name, nome, cognome, avatar, _id }) => {
  const displayName = name || [nome, cognome].filter(Boolean).join(" ");
  const defaultAvatar = "https://placehold.co/100x100?text=Avatar";

  return (
    <Row>
      <Col xs="auto" className="pe-0">
        <Image
          className="blog-author"
          src={avatar || defaultAvatar}
          roundedCircle
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
        />
      </Col>
      <Col>
        <div>di</div>
        <h6>
          <Link to={`/author/${_id}`} style={{ textDecoration: "none", color: "inherit" }}>
            {displayName}
          </Link>
        </h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;