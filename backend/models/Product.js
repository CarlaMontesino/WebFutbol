const db = require('../db');

const Product = {
  findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
};

module.exports = Product;