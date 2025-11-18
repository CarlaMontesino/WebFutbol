const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const dbPath = path.join(__dirname, '..', process.env.DATABASE_FILE || 'club.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos', err);
  } else {
    console.log(`Base de datos inicializada en ${dbPath}`);
  }
});

const createTables = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      telefono TEXT NOT NULL,
      email TEXT NOT NULL,
      fecha TEXT NOT NULL,
      hora TEXT NOT NULL,
      tipoCancha TEXT NOT NULL,
      estado TEXT DEFAULT 'pendiente'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreNino TEXT NOT NULL,
      edad INTEGER NOT NULL,
      categoria TEXT NOT NULL,
      nombreAdulto TEXT NOT NULL,
      telefono TEXT NOT NULL,
      email TEXT NOT NULL,
      estado TEXT DEFAULT 'pendiente'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      imagen TEXT,
      categoria TEXT,
      stock INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productos TEXT NOT NULL,
      total REAL NOT NULL,
      emailCliente TEXT NOT NULL,
      estado TEXT DEFAULT 'pendiente'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      asunto TEXT,
      mensaje TEXT NOT NULL,
      creadoEn DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    seedProducts();
  });
};

const seedProducts = () => {
  db.all('SELECT COUNT(*) as count FROM products', (err, rows) => {
    if (err) {
      console.error('Error contando productos iniciales', err);
      return;
    }

    if (rows[0].count === 0) {
      const sampleProducts = [
        {
          nombre: 'Camiseta oficial Patagonia Sur',
          descripcion: 'Modelo 2024, tela respirable, colores del club.',
          precio: 18000,
          imagen: '/assets/camiseta.svg',
          categoria: 'indumentaria',
          stock: 20
        },
        {
          nombre: 'Short entrenamiento',
          descripcion: 'Short liviano para entrenar en todas las categorías.',
          precio: 9500,
          imagen: '/assets/short.svg',
          categoria: 'indumentaria',
          stock: 35
        },
        {
          nombre: 'Buzo invierno',
          descripcion: 'Buzo térmico con capucha para entrenamientos nocturnos.',
          precio: 22000,
          imagen: '/assets/buzo.svg',
          categoria: 'indumentaria',
          stock: 10
        }
      ];

      const stmt = db.prepare(`INSERT INTO products (nombre, descripcion, precio, imagen, categoria, stock) VALUES (?, ?, ?, ?, ?, ?)`);
      sampleProducts.forEach((product) => {
        stmt.run(product.nombre, product.descripcion, product.precio, product.imagen, product.categoria, product.stock);
      });
      stmt.finalize();
      console.log('Productos de ejemplo cargados.');
    }
  });
};

createTables();

module.exports = db;