const express = require('express');
const Joi = require('joi');
const Contact = require('../models/Contact');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

const contactSchema = Joi.object({
  nombre: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  asunto: Joi.string().allow(''),
  mensaje: Joi.string().min(10).required()
});

router.post('/', validateRequest(contactSchema), async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    console.log('Consulta recibida', contact);
    res.status(201).json({ message: 'Gracias por escribirnos. Te responderemos a la brevedad.' });
  } catch (error) {
    console.error('Error al guardar contacto', error);
    res.status(500).json({ message: 'No pudimos enviar tu mensaje. Intentá nuevamente.' });
  }
});

module.exports = router;