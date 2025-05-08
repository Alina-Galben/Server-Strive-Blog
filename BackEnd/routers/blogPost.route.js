import express from 'express';
import blogPostModel from '../models/blogPostSchema.js';

const router = express.Router()

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
    const id = req.params.id;
    try {
        const blogPost = await blogPostModel.findById(id);
        res.status(200).json(blogPost);
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

router.post('/', async (req, res) => {
    const obj = req.body;
    const blogPost = new blogPostModel(obj);
    const dbBlogPost = await blogPost.save();
    res.status(201).json(dbBlogPost);
})

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