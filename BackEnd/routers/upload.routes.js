// Cloudinary routes
import express from 'express';
import { uploadAvatar, uploadCover } from '../middleware/multer.js';
import authorModel from '../models/authorSchema.js';
import blogPostModel from '../models/blogPostSchema.js';
import deleteFromCloudinary from '../utils/deleteFromCloudinary.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

/* Rota di test
router.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({
    message: 'File caricato con successo',
    fileUrl: req.file.path
  });
});
*/

// PATCH: aggiorna avatar autore e rimuove immagine precedente da Cloudinary
router.patch('/authors/:authorId/avatar', uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "⚠️ Avatar non caricato correttamente." });
    }

    const author = await authorModel.findById(req.params.authorId);
    if (!author) {
      return res.status(404).json({ error: "Autore non trovato." });
    }

    await deleteFromCloudinary(author.avatar); // Rimuovi il vecchio

    author.avatar = req.file.path;
    const updatedAuthor = await author.save();

    res.status(200).json(updatedAuthor);
  } catch (err) {
    console.error("❌ Errore aggiornamento avatar:", err.message);
    res.status(500).json({ error: "Errore interno del server: " + err.message });
  }
});

// PATCH: aggiorna cover blogPost e rimuove immagine precedente da Cloudinary
router.patch('/blogPosts/:blogPostId/cover', uploadCover.single('cover'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "⚠️ Cover non caricata correttamente." });
    }

    const post = await blogPostModel.findById(req.params.blogPostId);
    if (!post) {
      return res.status(404).json({ error: "Post non trovato." });
    }

    await deleteFromCloudinary(post.cover); // Rimuovi il vecchio

    post.cover = req.file.path;
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("❌ Errore aggiornamento cover:", err.message);
    res.status(500).json({ error: "Errore interno del server: " + err.message });
  }
});

export default router;
