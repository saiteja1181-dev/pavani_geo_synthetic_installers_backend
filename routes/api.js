const express = require('express');
const { db } = require('../database/database');
const router = express.Router();

// ===== USER ROUTES =====
router.get('/users', (req, res) => {
  console.log('📞 API - Fetching users...');
  
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

router.post('/users', (req, res) => {
  const { name, email } = req.body;
  console.log('📞 API - Creating user:', name);
  
  db.run(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    function(err) {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, email });
    }
  );
});

router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📞 API - Deleting user ID: ${id}`);
  
  db.run('DELETE FROM users WHERE id = ?', id, function(err) {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// ===== CONTACT ROUTE =====
router.get('/contact', (req, res) => {
  console.log('📞 API - Fetching contact info...');
  
  db.get('SELECT * FROM company_details LIMIT 1', (err, row) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ company: row });
  });
});

// ===== PRODUCTS ROUTES =====
router.get('/products', (req, res) => {
  console.log('📞 API - Fetching products...');
  
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ products: rows });
  });
});

router.get('/products/featured', (req, res) => {
  console.log('📞 API - Fetching featured products...');
  
  db.all('SELECT * FROM products WHERE is_featured = 1', (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ products: rows });
  });
});

router.get('/products/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📞 API - Fetching product ID: ${id}`);
  
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product: row });
  });
});

// ===== SERVICES ROUTES =====
router.get('/services', (req, res) => {
  console.log('📞 API - Fetching services...');
  
  db.all('SELECT * FROM services', (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ services: rows });
  });
});

router.get('/services/:id', (req, res) => {
  const { id } = req.params;
  console.log(`📞 API - Fetching service ID: ${id}`);
  
  db.get('SELECT * FROM services WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ service: row });
  });
});

// ===== GALLERY ROUTES =====
router.get('/gallery', (req, res) => {
  console.log('📞 API - Fetching gallery...');
  
  db.all('SELECT * FROM gallery', (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ gallery: rows });
  });
});




router.get('/quote-requests', (req, res) => {
  console.log('📞 API - Fetching gallery...');
  db.all(
    'SELECT * FROM quote_requests ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router
