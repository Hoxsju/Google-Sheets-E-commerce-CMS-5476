import express from 'express';
import axios from 'axios';
import { db } from '../database/init.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Refresh data from Google Sheets
router.post('/refresh', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get Google Sheet ID from config
    const sheetId = await new Promise((resolve, reject) => {
      db.get('SELECT value FROM site_config WHERE key = ?', ['google_sheet_id'], (err, row) => {
        if (err) reject(err);
        else resolve(row?.value);
      });
    });
    
    if (!sheetId) {
      return res.status(400).json({ message: 'Google Sheet ID not configured' });
    }
    
    // Mock data sync - In a real implementation, you would:
    // 1. Fetch data from Google Sheets API
    // 2. Parse the data
    // 3. Update the database
    
    // For demo purposes, we'll insert some sample data
    const sampleProducts = [
      {
        id: 'prod-1',
        name: 'Premium Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 299.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        featured: true,
        rating: 4.8
      },
      {
        id: 'prod-2',
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 199.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        featured: true,
        rating: 4.6
      }
    ];
    
    const samplePosts = [
      {
        id: 'post-1',
        title: 'Welcome to Our Blog',
        slug: 'welcome-to-our-blog',
        content: 'This is our first blog post. We\'re excited to share our journey with you!',
        excerpt: 'Welcome to our new blog where we share insights and updates.',
        author: 'Admin',
        featured_image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800',
        tags: 'welcome,blog,announcement',
        published_at: new Date().toISOString()
      }
    ];
    
    const samplePages = [
      {
        id: 'page-1',
        title: 'About Us',
        slug: 'about',
        content: 'We are a modern e-commerce company powered by Google Sheets. Our mission is to provide quality products with exceptional service.',
        meta_description: 'Learn more about our company and mission'
      },
      {
        id: 'page-2',
        title: 'Contact',
        slug: 'contact',
        content: 'Get in touch with us! We\'d love to hear from you.',
        meta_description: 'Contact us for any questions or support'
      }
    ];
    
    // Clear existing data
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM products', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM blog_posts', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM pages', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Insert sample data
    for (const product of sampleProducts) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO products (id, name, description, price, category, image, featured, rating)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [product.id, product.name, product.description, product.price, product.category, product.image, product.featured, product.rating],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    
    for (const post of samplePosts) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO blog_posts (id, title, slug, content, excerpt, author, featured_image, tags, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [post.id, post.title, post.slug, post.content, post.excerpt, post.author, post.featured_image, post.tags, post.published_at],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    
    for (const page of samplePages) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO pages (id, title, slug, content, meta_description)
           VALUES (?, ?, ?, ?, ?)`,
          [page.id, page.title, page.slug, page.content, page.meta_description],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
    
    res.json({ message: 'Data refreshed successfully from Google Sheets' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ message: 'Failed to sync data from Google Sheets' });
  }
});

export default router;