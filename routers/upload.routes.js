// Cloudinary routes
import express from 'express';
import upload from '../middleware/multer.js';
import authorModel from '../models/authorSchema.js';
import blogPostModel from '../models/blogPostSchema.js';

const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({
    message: 'File caricato con successo',
    fileUrl: req.file.path
  });
});

router.patch('/authors/:authorId/avatar', upload.single('avatar'), async (req, res) => {
    try {
      const updatedAuthor = await authorModel.findByIdAndUpdate(
        req.params.authorId,
        { avatar: req.file.path },
        { new: true }
      );
      res.status(200).json(updatedAuthor);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.patch('/blogPosts/:blogPostId/cover', upload.single('cover'), async (req, res) => {
    try {
      const updatedPost = await blogPostModel.findByIdAndUpdate(
        req.params.blogPostId,
        { cover: req.file.path },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

export default router;
