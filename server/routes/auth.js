import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/init.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Input validation helpers
const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const validateName = (name) => {
  const namePattern = /^[a-zA-Z\s'-]+$/;
  return namePattern.test(name) && name.length >= 2 && name.length <= 50;
};

const validatePassword = (password) => {
  return password.length >= 6 && password.length <= 128;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

// Register
router.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email).toLowerCase();
    password = sanitizeInput(password);

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate name
    if (!validateName(name)) {
      return res.status(400).json({ 
        message: 'Name must be 2-50 characters and contain only letters, spaces, apostrophes, and hyphens' 
      });
    }

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be between 6 and 128 characters' });
    }

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (row) {
        return res.status(400).json({ message: 'User already exists' });
      }

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ message: 'Failed to create user' });
            }

            // Generate JWT token
            const token = jwt.sign(
              { 
                userId: this.lastID, 
                email, 
                isAdmin: false 
              },
              JWT_SECRET,
              { expiresIn: '7d' }
            );

            res.status(201).json({
              user: {
                id: this.lastID,
                name,
                email,
                isAdmin: false
              },
              token
            });
          }
        );
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        return res.status(500).json({ message: 'Failed to process password' });
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // Sanitize inputs
    email = sanitizeInput(email).toLowerCase();
    password = sanitizeInput(password);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      try {
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: user.id, 
            email: user.email, 
            isAdmin: user.is_admin 
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: Boolean(user.is_admin)
          },
          token
        });
      } catch (compareError) {
        console.error('Password comparison error:', compareError);
        return res.status(500).json({ message: 'Authentication failed' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    db.get('SELECT * FROM users WHERE id = ?', [decoded.userId], (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: Boolean(user.is_admin)
      });
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;