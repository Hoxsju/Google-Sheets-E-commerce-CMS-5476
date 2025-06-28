import express from 'express';
import { db } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get site configuration
router.get('/', (req, res) => {
  db.all('SELECT key, value FROM site_config', (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    const config = {};
    rows.forEach(row => {
      config[row.key] = row.value;
    });
    
    res.json(config);
  });
});

// Update site configuration
router.put('/', authenticateToken, requireAdmin, (req, res) => {
  const { title, logo, customCSS, customJS, googleSheetId } = req.body;
  
  const updates = [
    ['title', title],
    ['logo', logo],
    ['custom_css', customCSS],
    ['custom_js', customJS],
    ['google_sheet_id', googleSheetId]
  ];
  
  let completed = 0;
  const total = updates.length;
  
  updates.forEach(([key, value]) => {
    db.run(
      'INSERT OR REPLACE INTO site_config (key, value) VALUES (?, ?)',
      [key, value],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to update configuration' });
        }
        
        completed++;
        if (completed === total) {
          res.json({ message: 'Configuration updated successfully' });
        }
      }
    );
  });
});

export default router;