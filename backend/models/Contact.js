const db = require('../db');

const Contact = {
  create(data) {
    return new Promise((resolve, reject) => {
      const { nombre, email, asunto, mensaje } = data;
      const stmt = `INSERT INTO contacts (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)`;
      db.run(stmt, [nombre, email, asunto, mensaje], function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, ...data });
      });
    });
  }
};

module.exports = Contact;