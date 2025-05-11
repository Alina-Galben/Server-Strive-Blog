import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";

const CommentArea = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () =>
    localStorage.getItem("token") || process.env.REACT_APP_TOKEN;

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_APYURL}/comments/blogPosts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const data = await res.json();
      setComments(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
    } catch (err) {
      console.error("Errore caricamento commenti:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_APYURL}/comments/blogPosts/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ userName, text }),
        }
      );

      if (res.ok) {
        setUserName("");
        setText("");
        fetchComments(); // aggiorna
      } else {
        alert("Errore nell'invio del commento");
      }
    } catch (err) {
      console.error("Errore invio commento:", err);
    }
  };

  return (
    <div className="mt-5">
      <h4>Commenti</h4>

      {loading ? (
        <Spinner animation="border" />
      ) : comments.length === 0 ? (
        <p>Nessun commento ancora.</p>
      ) : (
        <ul>
          {comments.map((comment, i) => (
            <li key={i}>
              <strong>{comment.userName}</strong>: {comment.text}
            </li>
          ))}
        </ul>
      )}

      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group className="mb-2">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Commento</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="dark">
          Invia
        </Button>
      </Form>
    </div>
  );
};

export default CommentArea;