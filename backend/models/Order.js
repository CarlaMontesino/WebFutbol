const db = require('../db');

const Order = {
  create(data) {
    return new Promise((resolve, reject) => {
      const { productos, total, emailCliente, estado = 'pendiente' } = data;
      const stmt = `INSERT INTO orders (productos, total, emailCliente, estado) VALUES (?, ?, ?, ?)`;
      db.run(stmt, [JSON.stringify(productos), total, emailCliente, estado], function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, ...data });
      });
    });
  }
};

module.exports = Order;