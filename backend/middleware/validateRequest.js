module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Datos inválidos, revisá el formulario.',
      detalles: error.details.map((detail) => detail.message)
    });
  }
  next();
};