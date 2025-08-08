import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authorModel from '../models/authorSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadAvatar } from '../middleware/multer.js';
import passport from 'passport'

const router = express.Router();

// REGISTRAZIONE CLASSICA
router.post('/register', uploadAvatar.single("avatar"), async (req, res) => {
    try {
        const { nome, cognome, username, email, dataDiNascita, password } = req.body;
        const avatar = req.file?.path;

        if(!nome || !cognome || !username || !email || !dataDiNascita || !avatar || !password )
            return res.status(400).json({ error: 'Tutti i campi sono obbligatori'});

        const emailExists = await authorModel.findOne({ email });
        if(emailExists) return res.status(409).json({ error: 'Email gia registrata'});

        const usernameExists = await authorModel.findOne({ username });
        if(usernameExists) return res.status(409).json({ error: 'Username gia registrata'});

        const newUser = new authorModel({ nome, cognome, username, email, dataDiNascita, avatar, password });
        await newUser.save();

        res.status(201).json({ message: 'Utente registrato correttamente'});
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // identifier = identificazione o con email o con username

    try {
        // Cerca l'utente per email o username
        const user = await authorModel.findOne({ 
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        });
        
        if (!user) return res.status(404).json({ error: 'Utente non trovato'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(404).json({ error: 'Credenziali non valide'});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '48h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ME
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await authorModel.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// Avvia autenticazione con Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Callback dopo autenticazione Google
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '48h',
    })

    // Redirige il token al frontend (adatta la URL se serve)
    res.redirect(`http://localhost:3000/login?token=${token}`)
  }
)

export default router