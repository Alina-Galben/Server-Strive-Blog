import express from 'express';
import authorModel from '../models/authorSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// 1. isActive true
router.get('/active', async (req, res) => {
    try {
        const results = await authorModel.find({ isActive: true });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. age > 26
router.get('/age-gt-26', async (req, res) => {
    try {
        const results = await authorModel.find({ age: { $gt: 26 } });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. 26 < age <= 30
router.get('/age-between', async (req, res) => {
    try {
        const results = await authorModel.find({ age: { $gt: 26, $lte: 30 } });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. eyes = brown OR blue
router.get('/eyes-brown-blue', async (req, res) => {
    try {
        const results = await authorModel.find({ eyes: { $in: ['brown', 'blue'] } });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. eyes ≠ green
router.get('/eyes-not-green', async (req, res) => {
    try {
        const results = await authorModel.find({ eyes: { $ne: 'green' } });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. eyes ≠ green AND ≠ blue
router.get('/eyes-not-green-blue', async (req, res) => {
    try {
        const results = await authorModel.find({ eyes: { $nin: ['green', 'blue'] } });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. company = FITCORE, return only email
router.get('/email-fitcore', async (req, res) => {
    try {
        const results = await authorModel.find({ company: 'FITCORE' }, { email: 1, _id: 0 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
