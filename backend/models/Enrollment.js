const db = require('../db');

const Enrollment = {
  create(data) {
    return new Promise((resolve, reject) => {
      const { nombreNino, edad, categoria, nombreAdulto, telefono, email } = data;
      const stmt = `INSERT INTO enrollments (nombreNino, edad, categoria, nombreAdulto, telefono, email, estado) VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`;
      db.run(stmt, [nombreNino, edad, categoria, nombreAdulto, telefono, email], function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ id: this.lastID, ...data, estado: 'pendiente' });
      });
    });
  }
};

module.exports = Enrollment;