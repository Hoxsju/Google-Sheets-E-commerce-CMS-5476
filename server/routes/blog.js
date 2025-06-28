import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Get all blog posts
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM blog_posts WHERE published_at IS NOT NULL ORDER BY published_at DESC',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(rows);
    }
  );
});

// Get single blog post
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  
  db.get('SELECT * FROM blog_posts WHERE slug = ?', [slug], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Get comments for this post
    db.all(
      `SELECT c.*, u.name as user_name 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.post_id = ? AND c.approved = TRUE 
       ORDER BY c.created_at DESC`,
      [row.id],
      (err, comments) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        
        res.json({
          ...row,
          comments: comments || []
        });
      }
    );
  });
});

// Add comment to blog post
router.post('/:slug/comments', (req, res) => {
  // This would require authentication middleware
  // For now, return a placeholder response
  res.status(501).json({ message: 'Comment functionality not implemented yet' });
});

export default router;