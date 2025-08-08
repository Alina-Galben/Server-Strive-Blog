import React, { useEffect, useState } from "react";
import { Button, Container, Navbar, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    if (token) fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <Stack direction="horizontal" gap={3}>
          <Button as={Link} to="/new" className="bg-dark" size="lg">
            + Nuovo Articolo
          </Button>

          {user ? (
            <>
              <Button as={Link} to={`/author/me`} variant="outline-dark" size="lg">
                Profilo
              </Button>
              <Button onClick={handleLogout} variant="outline-danger" size="lg">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/register" variant="outline-dark" size="lg">
                Registrati
              </Button>
              <Button as={Link} to="/login" variant="outline-dark" size="lg">
                Login
              </Button>
            </>
          )}
        </Stack>
      </Container>
    </Navbar>
  );
};

export default NavBar;