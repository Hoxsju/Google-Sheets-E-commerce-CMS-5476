import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', authenticateToken, (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod } = req.body;
    const userId = req.user.userId;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }
    
    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderId = uuidv4();
    
    db.run(
      `INSERT INTO orders (id, user_id, items, total, shipping_address, billing_address, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        userId,
        JSON.stringify(items),
        total,
        JSON.stringify(shippingAddress),
        JSON.stringify(billingAddress),
        paymentMethod
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Failed to create order' });
        }
        
        res.status(201).json({
          id: orderId,
          status: 'pending',
          total,
          items
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  db.all(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      const orders = rows.map(row => ({
        ...row,
        items: JSON.parse(row.items),
        shipping_address: row.shipping_address ? JSON.parse(row.shipping_address) : null,
        billing_address: row.billing_address ? JSON.parse(row.billing_address) : null
      }));
      
      res.json(orders);
    }
  );
});

// Get single order
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  db.get(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [id, userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json({
        ...row,
        items: JSON.parse(row.items),
        shipping_address: row.shipping_address ? JSON.parse(row.shipping_address) : null,
        billing_address: row.billing_address ? JSON.parse(row.billing_address) : null
      });
    }
  );
});

export default router;