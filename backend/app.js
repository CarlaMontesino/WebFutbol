const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
require('./db');

const bookingsRouter = require('./routes/bookings');
const enrollmentsRouter = require('./routes/enrollments');
const storeRouter = require('./routes/store');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend como plantilla reutilizable.
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));

app.use('/api/bookings', bookingsRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/store', storeRouter);
app.use('/api/contact', contactRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', club: 'Club Deportivo Patagonia Sur' });
});

app.use((err, _req, res, _next) => {
  console.error('Error inesperado', err);
  res.status(500).json({ message: 'Algo salió mal. Intentá nuevamente.' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});