// Run: npm run seed
const db = require('./db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    price_cents INTEGER,
    currency TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    created_at TEXT,
    items_json TEXT,
    total_cents INTEGER
  )`);

  const insert = db.prepare('INSERT OR REPLACE INTO products (id,name,description,price_cents,currency) VALUES (?,?,?,?,?)');

  const products = [
    ['p1','Blue T-Shirt','Comfortable cotton t-shirt',1999,'USD'],
    ['p2','Coffee Mug','Ceramic mug, 350ml',1299,'USD'],
    ['p3','Notebook','A5 ruled notebook',799,'USD'],
    ['p4','Wireless Mouse','Ergonomic mouse',2599,'USD']
  ];

  products.forEach(p => insert.run(...p));
  insert.finalize(err => {
    if (err) console.error(err);
    else console.log('Seeded products');
    db.close();
  });
});
