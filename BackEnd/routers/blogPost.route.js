import express from 'express';
import blogPostModel from '../models/blogPostSchema.js';
import { uploadCover } from '../middleware/multer.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const size = parseInt(req.query.size) || 10;
        const page = parseInt(req.query.page) || 1;
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        
        const conditions =[]

        // Costruzione dinamica delle condizioni sui campi di BlogPostSchema

        // 1) Categoria che contiene qualcosa
        if (req.query.category) {
            conditions.push({ category: { $regex: req.query.category, $options: 'i'} });
        }

        // 2) Cognome che contiene qualcosa
        if (req.query.title) {
            conditions.push({ title: { $regex: req.query.title, $options: 'i'} });
        }

        // 3) Tempo di lettura maggiore di un certo valore
        if (req.query.minReadTime) {
            conditions.push({ readTime: { $gte: parseInt(req.query.minReadTime) } });
        }

        // 4) Tempo di lettura minore di un certo valore
        if (req.query.maxReadTime) {
            conditions.push({ readTime: { $gte: parseInt(req.query.dataMassima) } });
        }

        // 5) Costruisco il filtro finale
        const filter = conditions.length > 0 ? { $and: conditions } : {};

        const blogPost = await blogPostModel.find(filter).sort({ [sortField]: sortOrder }).limit(size).skip((page - 1) * size);

        res.status(200).json(blogPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
});

router.get('/:id', async (req, res) => {
  try {
    const post = await blogPostModel.findById(req.params.id).populate("author");

    if (!post) {
      return res.status(404).json({ error: "Post non trovato" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* Post classico senza upload
router.post('/', async (req, res) => {
    const obj = req.body;
    const blogPost = new blogPostModel(obj);
    const dbBlogPost = await blogPost.save();
    res.status(201).json(dbBlogPost);
})
*/

// Post Creazione blogPost con file copertina - cover con upload
router.post('/', uploadCover.single('cover'), async (req, res) => {
    try {
      console.log("📝 Creazione blogPost - BODY:", req.body);
      console.log("🖼️ File copertina ricevuto:", req.file);
  
      const { category, title, readTime, author, content } = req.body;
  
      // 1. Controllo campi obbligatori
      if (!category || !title || !readTime || !author || !content) {
        return res.status(400).json({ error: "⚠️ Campi obbligatori mancanti (category, title, readTime, author, content)." });
      }
  
      const parsedReadTime = JSON.parse(readTime); // perché Postman potrebbe inviarlo come stringa
  
      // 2. Gestione copertina
      let cover;
      if (req.file && req.file.path) {
        cover = req.file.path;
      } else {
        cover = "https://example.com/default-cover.jpg";
        console.warn("⚠️ Nessuna cover caricata. Uso cover di default.");
      }
  
      // 3. Creazione del nuovo blog post
      const newPost = new blogPostModel({
        category,
        title,
        cover,
        readTime: {
          value: parsedReadTime.value,
          unit: parsedReadTime.unit
        },
        author,
        content
      });
  
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
  
    } catch (error) {
      console.error("❌ Errore creazione blogPost:", error.message);
      if (error.response?.body) {
        console.error("📡 Dettagli Cloudinary:", error.response.body);
      }
      res.status(500).json({ error: "Errore interno del server: " + error.message });
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const obj = req.body;
    try {
        const blogPostUpdate = await blogPostModel.findByIdAndUpdate(id, obj)
        res.status(200).json(blogPostUpdate)
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await blogPostModel.findByIdAndDelete(id);
        res.status(200).json({message: "Blog Post Deleted"})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

export default router;