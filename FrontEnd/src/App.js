import React from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import New from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthorPosts from "./views/author/AuthorPosts";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import AuthorProfile from "./views/author/AuthorProfile";
import AuthorMe from "./views/author/AuthorMe";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<New />} />
        <Route path="/author/:id/posts" element={<AuthorPosts />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/author/:id" element={<AuthorProfile />} />
        <Route path="/author/me" element={<AuthorMe />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;