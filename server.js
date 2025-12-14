const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase, db } = require('./database/database');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE (FIRST) =====
app.use(cors({
  origin: "*", // allow all for now
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'images')));

// ===== ROUTES =====
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
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
  db.all(`SELECT * FROM services`, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Gallery
app.get('/gallery', (req, res) => {
  db.all(`SELECT * FROM gallery`, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Products
app.get('/products', (req, res) => {
  db.all(`SELECT * FROM products`, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Quote request
app.post('/quote-requests', (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !phone || !service) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO quote_requests (name, email, phone, service, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, phone, service, message, new Date().toISOString()], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to save request' });

    res.json({
      success: true,
      message: 'Quote request submitted successfully',
      id: this.lastID
    });
  });
});



// Get all quote requests
app.get('/quote-requests', (req, res) => {
  console.log('📞 SERVER - GET /quote-requests called');

  db.all(
    'SELECT * FROM quote_requests ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error('❌ DB error fetching quote_requests:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`✅ Returning ${rows.length} quote_requests`);
      res.json({ quote_requests: rows });
    }
  );
});


app.get('/_tables', (req, res) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
    if (err) {
      console.error('❌ DB error listing tables:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows.map(r => r.name));
  });
}); 


// ===== START SERVER =====
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
  });




