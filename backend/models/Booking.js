const db = require('../db');

const Booking = {
  create(data) {
    return new Promise((resolve, reject) => {
      const { nombre, telefono, email, fecha, hora, tipoCancha } = data;
      const stmt = `INSERT INTO bookings (nombre, telefono, email, fecha, hora, tipoCancha, estado) VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`;
      db.run(stmt, [nombre, telefono, email, fecha, hora, tipoCancha], function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, ...data, estado: 'pendiente' });
      });
    });
  }
};

module.exports = Booking;