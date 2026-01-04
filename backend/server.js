const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// GET /api/products
app.get('/api/products', (req, res) => {
  db.all('SELECT id, name, description, price_cents, currency FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/checkout
// Expects { items: [{id, name, price_cents, quantity}], total_cents }
app.post('/api/checkout', (req, res) => {
  const { items, total_cents } = req.body;
  if (!items || !Array.isArray(items)) return res.status(400).json({ error: 'Invalid items' });

  const orderId = nanoid(10);
  const createdAt = new Date().toISOString();
  const itemsJson = JSON.stringify(items);

  db.run(
    `INSERT INTO orders (id, created_at, items_json, total_cents) VALUES (?,?,?,?)`,
    [orderId, createdAt, itemsJson, total_cents],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // This is a mocked checkout. In production create a payment session (Stripe/PayPal) instead.
      res.json({ orderId, status: 'saved' });
    }
  );
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  db.get('SELECT id, created_at, items_json, total_cents FROM orders WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Order not found' });
    row.items = JSON.parse(row.items_json);
    delete row.items_json;
    res.json(row);
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Backend listening on', PORT);
});
