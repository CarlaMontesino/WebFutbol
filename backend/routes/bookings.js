const express = require('express');
const Joi = require('joi');
const Booking = require('../models/Booking');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const bookingSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  telefono: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  fecha: Joi.string().required(),
  hora: Joi.string().required(),
  tipoCancha: Joi.string().required()
});

router.post('/', validateRequest(bookingSchema), async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: 'Solicitud registrada. Te contactaremos para confirmar.', booking });
  } catch (error) {
    console.error('Error al crear reserva', error);
    res.status(500).json({ message: 'No pudimos registrar la reserva. Probá nuevamente.' });
  }
});

module.exports = router;