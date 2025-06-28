import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    // Parse JSON fields
    const products = rows.map(row => ({
      ...row,
      featured: Boolean(row.featured)
    }));
    
    res.json(products);
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      ...row,
      featured: Boolean(row.featured)
    });
  });
});

export default router;