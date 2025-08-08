import React, { useState, useEffect, useCallback } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";

const getToken = () => {
  return localStorage.getItem("token") || process.env.REACT_APP_TOKEN;
};

const NewBlogPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [readTimeValue, setReadTimeValue] = useState("");
  const [readTimeUnit, setReadTimeUnit] = useState("minute");
  const [authorId, setAuthorId] = useState("");
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleEditorChange = useCallback((state) => {
    setEditorState(state);
  }, []);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAuthorId(data._id);
        }
      } catch (err) {
        console.error("Errore nel recupero utente loggato:", err);
      }
    };

    fetchLoggedInUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("author", authorId);
    formData.append("cover", coverFile);
    formData.append("content", draftToHtml(convertToRaw(editorState.getCurrentContent())));
    formData.append("readTime", JSON.stringify({ value: Number(readTimeValue), unit: readTimeUnit }));

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPost`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Articolo pubblicato con successo!");
        setTitle("");
        setCategory("");
        setCoverFile(null);
        setReadTimeValue("");
        setReadTimeUnit("minute");
        setEditorState(EditorState.createEmpty());
      } else {
        alert("Errore nella pubblicazione dell'articolo.");
      }
    } catch (error) {
      console.error("Errore durante l'invio del form:", error);
      alert("Si è verificato un errore durante la pubblicazione.");
    }
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group controlId="blog-title" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control size="lg" placeholder="Titolo dell'articolo"
            value={title} onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select size="lg" value={category}
            onChange={(e) => setCategory(e.target.value)}
            required>
            <option value="">Seleziona una categoria</option>
            <option>Getting Started</option>
            <option>The W Pledge</option>
            <option>Learnings and Tips</option>
            <option>Student Stories</option>
            <option>Tecnologia</option>
            <option>Storia</option>
            <option>Altro</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto del Blog</Form.Label>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
          />
        </Form.Group>

        <Form.Group controlId="blog-cover" className="mt-3">
          <Form.Label>Copertina (immagine)</Form.Label>
          <Form.Control size="lg" type="file" accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            required
          />
        </Form.Group>

        <Form.Group controlId="blog-readtime" className="mt-3">
          <Form.Label>Tempo di Lettura</Form.Label>
          <Form.Control type="number" placeholder="Es: 5" value={readTimeValue}
            onChange={(e) => setReadTimeValue(e.target.value)}
            required
          />
          <Form.Select className="mt-2" value={readTimeUnit}
            onChange={(e) => setReadTimeUnit(e.target.value)}>
            <option value="minute">Minuti</option>
            <option value="hour">Ore</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark"
            onClick={() => {
              setTitle("");
              setCategory("");
              setCoverFile(null);
              setReadTimeValue("");
              setReadTimeUnit("minute");
              setEditorState(EditorState.createEmpty());
            }}>
            Reset
          </Button>
          <Button type="submit" size="lg" variant="dark" style={{ marginLeft: "1em" }}>
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;