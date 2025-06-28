import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');

export const db = new sqlite3.Database(dbPath);

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          is_admin BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Products table (cached from Google Sheets)
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          category TEXT,
          image TEXT,
          availability TEXT DEFAULT 'in_stock',
          featured BOOLEAN DEFAULT FALSE,
          rating REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Blog posts table (cached from Google Sheets)
      db.run(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          author TEXT,
          featured_image TEXT,
          tags TEXT,
          published_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Pages table (cached from Google Sheets)
      db.run(`
        CREATE TABLE IF NOT EXISTS pages (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          content TEXT NOT NULL,
          meta_description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          user_id INTEGER NOT NULL,
          items TEXT NOT NULL,
          total REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          shipping_address TEXT,
          billing_address TEXT,
          payment_method TEXT,
          payment_status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Comments table
      db.run(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          post_id TEXT NOT NULL,
          content TEXT NOT NULL,
          approved BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (post_id) REFERENCES blog_posts (id)
        )
      `);

      // Site configuration table
      db.run(`
        CREATE TABLE IF NOT EXISTS site_config (
          key TEXT PRIMARY KEY,
          value TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert default admin user
      db.run(`
        INSERT OR IGNORE INTO users (name, email, password, is_admin)
        VALUES ('Admin', 'admin@example.com', '$2a$10$rOFLkNW.qV7YdLpRHJ8mYe6Nq5rYqGpSdE8qVq8nKqVqGpSdE8qV2', TRUE)
      `);

      // Insert default site config
      db.run(`
        INSERT OR IGNORE INTO site_config (key, value)
        VALUES 
          ('title', 'Sheets Commerce'),
          ('logo', ''),
          ('google_sheet_id', ''),
          ('custom_css', ''),
          ('custom_js', ''),
          ('stripe_public_key', ''),
          ('stripe_secret_key', '')
      `);

      resolve();
    });
  });
};