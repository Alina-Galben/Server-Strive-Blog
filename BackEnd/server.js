import express from 'express';
import cors from 'cors';
import "dotenv/config";
import db from './db.js';
import './models/authorSchema.js'; // così registro lo schema all'avvio
import passport from 'passport'
import './config/passport.js' // Strategia Google
import path from "path";
import { fileURLToPath } from "url";

// ROUTERS
import authorsRouter from './routers/authors.route.js'
import blogPostRouter from './routers/blogPost.route.js'
import queryCustomRouter from './routers/queryCustom.route.js';
import uploadRoutes from './routers/upload.routes.js'; // Le rotte di cloudinary
import commentsRouter from './routers/comments.route.js'; // Le rote dei commenti
import authRouter from './routers/auth.route.js';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware base
app.use(cors())
app.use(express.json())
app.use(passport.initialize()) // Inizializza Passport

// Serve file statici dalla cartella "public"
app.use(express.static(path.join(__dirname, "public"))); // 🔹 Cosi rendo pubblica l'intera cartella public

// API
app.use('/authors', authorsRouter)
app.use('/blogPost', blogPostRouter)
app.use('/queries', queryCustomRouter);
app.use('/api', uploadRoutes);
app.use('/comments', commentsRouter);
app.use('/auth', authRouter);


// Creazione API - Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Avvio del server SOLO dopo la connessione al DB
const startServer = async () => {
    try {
        await db();
        app.listen(process.env.PORT, () => {
            console.log('Server is running on port ' + process.env.PORT);
        });
    } catch (error) {
        console.error('Server not started due to DB connection error');
    }
};

startServer();