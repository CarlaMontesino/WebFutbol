const express = require('express');
const Joi = require('joi');
const Enrollment = require('../models/Enrollment');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const enrollmentSchema = Joi.object({
  nombreNino: Joi.string().min(2).required(),
  edad: Joi.number().min(5).max(17).required(),
  categoria: Joi.string().required(),
  nombreAdulto: Joi.string().min(3).required(),
  telefono: Joi.string().min(6).required(),
  email: Joi.string().email().required()
});

router.post('/', validateRequest(enrollmentSchema), async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json({ message: '¡Inscripción registrada! Nos comunicaremos para confirmar la vacante.', enrollment });
  } catch (error) {
    console.error('Error al crear inscripción', error);
    res.status(500).json({ message: 'No pudimos registrar la inscripción. Intentá más tarde.' });
  }
});

module.exports = router;