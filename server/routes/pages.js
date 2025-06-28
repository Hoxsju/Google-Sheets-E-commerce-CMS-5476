import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Get all pages
router.get('/', (req, res) => {
  db.all('SELECT * FROM pages ORDER BY title', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    res.json(rows);
  });
});

// Get single page
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  
  db.get('SELECT * FROM pages WHERE slug = ?', [slug], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ message: 'Page not found' });
    }
    
    res.json(row);
  });
});

export default router;