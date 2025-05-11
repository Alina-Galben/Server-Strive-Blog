import express from 'express';
import authorModel from '../models/authorSchema.js';
import { uploadAvatar } from '../middleware/multer.js'
import sendEmail from '../utils/sendEmail.js';
import authMiddleware from '../middleware/authMiddleware.js';
import blogPostModel from '../models/blogPostSchema.js';

const router = express.Router()

router.use(authMiddleware); // Middleware per pa protezione

router.get('/', async (req, res) => {
  try {
    const size = parseInt(req.query.size) || 10;
    const page = parseInt(req.query.page) || 1;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        
    const conditions =[]

    // Costruzione dinamica delle condizioni

    // 1) Nome che contiene qualcosa
    if (req.query.nome) {
        conditions.push({ nome: { $regex: req.query.nome, $options: 'i'} });
    }

    // 2) Cognome che contiene qualcosa
    if (req.query.cognome) {
        conditions.push({ cognome: { $regex: req.query.cognome, $options: 'i'} });
    }

    // 3) Data di nascita più grande di una certa data
    if (req.query.dataMinima) {
        conditions.push({ dataDiNascita: { $gte: req.query.dataMinima } });
    }

    // 4) Data di nascita più piccola di una certa data
    if (req.query.dataMassima) {
        conditions.push({ dataDiNascita: { $gte: req.query.dataMassima } });
    }

    // 5) Costruisco il filtro finale
    const filter = conditions.length > 0 ? { $and: conditions } : {};

    const authors = await authorModel.find(filter).sort({ [sortField]: sortOrder }).limit(size).skip((page - 1) * size);

    res.status(200).json(authors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
    
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const author = await authorModel.findById(id);
    res.status(200).json(author);
  } catch(err) {
    res.status(500).json({error: err.message})
  }
})

// Rotta per i blog degli autori
router.get('/:id/blogPosts', async (req, res) => {
  try {
    const posts = await blogPostModel.find({ author: req.params.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* Post classico senza upload
router.post('/', async (req, res) => {
    const obj = req.body;
    const author = new authorModel(obj);
    const dbAuthor = await author.save();
    res.status(201).json(dbAuthor);
})
*/

// Post con inserimento dati, file imagine e email - avatar con upload
router.post('/', uploadAvatar.single('avatar'), async (req, res) => {
  try {
    console.log("📥 Richiesta ricevuta - BODY:", req.body);
    console.log("🖼️ File ricevuto:", req.file);
  
    const { nome, cognome, email, dataDiNascita } = req.body;
  
    // 1. Controllo campi obbligatori
    if (!nome || !cognome || !email || !dataDiNascita) {
      return res.status(400).json({ error: "⚠️ Campi obbligatori mancanti (nome, cognome, email, dataDiNascita)." });
    }
  
    // 2. Controllo email già esistente
    const emailExists = await authorModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ error: "⚠️ Email già esistente." });
    }
  
    // 3. Avatar lo segnala in console
    let avatar;
    if (req.file && req.file.path) {
      avatar = req.file.path;
    } else {
      avatar = "https://example.com/default.png";
      console.warn("⚠️ Avatar mancante. Usato avatar di default.");
    }
  
    // 4. Creazione autore
    const newAuthor = new authorModel({ nome, cognome, email, dataDiNascita, avatar });
    const savedAuthor = await newAuthor.save();
  
    // 5. Email di benvenuto
    try {
      await sendEmail({
        to: savedAuthor.email,
        subject: 'Benvenuto su Strive Blog!',
        text: `Ciao ${savedAuthor.nome}, grazie per esserti registrato!`,
        html: `<strong>Ciao ${savedAuthor.nome}</strong>,<br/>grazie per esserti registrato su <em>Strive Blog</em>!`
      });
    } catch (emailErr) {
      console.warn("📧 Errore invio email (non blocca):", emailErr.message);
    }
  
    res.status(201).json(savedAuthor);
  
  } catch (error) {
    console.error("❌ Errore interno:", error.message);
    if (error.response?.body) {
      console.error("🔍 Dettagli Cloudinary:", error.response.body);
    }
    res.status(500).json({ error: "Errore interno del server: " + error.message });
  }
});
  

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const obj = req.body;
  try {
    const authorUpdate = await authorModel.findByIdAndUpdate(id, obj)
    res.status(200).json(authorUpdate)
  } catch(err) {
    res.status(500).json({error: err.message})
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await authorModel.findByIdAndDelete(id);
    res.status(200).json({message: "Author Deleted"})
  } catch(err) {
    res.status(500).json({error: err.message})
  }
})

export default router;