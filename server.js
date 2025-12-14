const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase, db } = require('./database/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'images')));

// ===== ROUTES =====
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Company details
app.get('/company_details', (req, res) => {
  const sql = `SELECT * FROM company_details LIMIT 1`;
  db.get(sql, (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(row || {
      name: 'Pavani Geo Synthetic',
      phone: '+91-9652657383',
      email: 'info@pavanigeosynthetic.com',
      address: 'Industrial Area, Hyderabad, Telangana'
    });
  });
});

// Services
app.get('/services', (req, res) => {
  const sql = `SELECT * FROM services`;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Gallery
app.get('/gallery', (req, res) => {
  const sql = `SELECT * FROM gallery`;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Products
app.get('/products', (req, res) => {
  const sql = `SELECT * FROM products`;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// ===== QUOTE REQUEST ROUTE =====
app.post('/quote-requests', (req, res) => {
  const { name, email, phone, service, message } = req.body;
  
  // Simple validation
  if (!name || !email || !phone || !service) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO quote_requests (name, email, phone, service, message, created_at) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const values = [name, email, phone, service, message, new Date().toISOString()];
  
  db.run(sql, values, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save request' });
    }
    
    res.json({ 
      success: true, 
      message: 'Quote request submitted successfully',
      id: this.lastID 
    });
  });
});

// Get quote requests
app.get('/quote-requests', (req, res) => {
  const sql = `SELECT * FROM quote_requests ORDER BY created_at DESC`;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// ===== START SERVER =====
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);

});

// Add this to your main server file (e.g., app.js, server.js, index.js)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


app.use(cors({
  origin: "*", // allow all (safe for now)
  methods: ["GET", "POST", "PUT", "DELETE"],
}));



