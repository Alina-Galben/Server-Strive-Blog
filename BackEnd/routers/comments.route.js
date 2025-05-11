import express from 'express';
import blogPostModel from '../models/blogPostSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// GET all comments for a post
router.get('/blogPosts/:id', async (req, res) => {
  try {
    const post = await blogPostModel.findById(req.params.id);
    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single comment
router.get('/blogPosts/:id/:commentId', async (req, res) => {
  try {
    const post = await blogPostModel.findById(req.params.id);
    const comment = post.comments.id(req.params.commentId);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new comment
router.post('/blogPosts/:id', async (req, res) => {
  try {
    const post = await blogPostModel.findById(req.params.id);
    post.comments.push(req.body); // req.body = { userName, text }
    await post.save();
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update comment
router.put('/blogPosts/:id/:commentId', async (req, res) => {
  try {
    const post = await blogPostModel.findById(req.params.id);
    const comment = post.comments.id(req.params.commentId);
    comment.set(req.body); // aggiornamento con { nome e text }
    await post.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a comment
router.delete('/blogPosts/:id/:commentId', async (req, res) => {
  try {
    const post = await blogPostModel.findById(req.params.id);
    post.comments.id(req.params.commentId).remove();
    await post.save();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;