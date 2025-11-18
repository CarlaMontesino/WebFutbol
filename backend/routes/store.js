const express = require('express');
const Joi = require('joi');
const Product = require('../models/Product');
const Order = require('../models/Order');
const validateRequest = require('../middleware/validateRequest');
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const orderSchema = Joi.object({
  productos: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      nombre: Joi.string().required(),
      precio: Joi.number().required(),
      cantidad: Joi.number().min(1).required(),
      talle: Joi.string().allow('')
    })
  ).min(1).required(),
  total: Joi.number().required(),
  emailCliente: Joi.string().email().required()
});

router.get('/products', async (_req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).json({ message: 'No pudimos cargar los productos.' });
  }
});

router.post('/orders', validateRequest(orderSchema), async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: 'Pedido registrado. Iniciá el pago para finalizar.', order });
  } catch (error) {
    console.error('Error al crear pedido', error);
    res.status(500).json({ message: 'No pudimos registrar el pedido.' });
  }
});

// Configuración Mercado Pago sandbox. Reemplazar con credenciales reales.
if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
  mercadopago.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN });
}

router.post('/payments/create-preference', async (req, res) => {
  const { productos, total } = req.body;
  if (!productos || !productos.length) {
    return res.status(400).json({ message: 'No hay productos para pagar.' });
  }

  // Preferencia básica. En producción se recomienda enviar ID de pedido, URLs propias, etc.
  const preference = {
    items: productos.map((producto) => ({
      title: producto.nombre,
      unit_price: Number(producto.precio),
      quantity: Number(producto.cantidad)
    })),
    back_urls: {
      success: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-exitoso.html`,
      failure: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-fallido.html`,
      pending: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-pendiente.html`
    },
    auto_return: 'approved'
  };

  try {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      // Simulación para no depender de credenciales reales.
      return res.json({
        init_point: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-simulado.html?total=${total}`,
        sandbox_init_point: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pago-simulado.html?total=${total}`,
        simulated: true
      });
    }

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point, sandbox_init_point: response.body.sandbox_init_point });
  } catch (error) {
    console.error('Error al crear preferencia de pago', error);
    res.status(500).json({ message: 'No pudimos iniciar el pago. Intentá nuevamente.' });
  }
});

module.exports = router;