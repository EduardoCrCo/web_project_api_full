const errorHandler = (err, req, res, next) => {
  console.error(err) // Para debugging en desarrollo

  // Error personalizado con statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).send({
      status: false,
      message: err.message,
    })
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).send({
      status: false,
      message: 'Validation error',
      details: Object.values(err.errors).map((e) => e.message),
    })
  }

  // Error de documento no encontrado
  if (err.name === 'DocumentNotFoundError') {
    return res.status(404).send({
      status: false,
      message: 'Resource not found',
    })
  }

  // Error de duplicado (email único, etc.)
  if (err.code === 11000) {
    return res.status(409).send({
      status: false,
      message: 'Resource already exists',
    })
  }

  // Error de Cast (ID inválido de MongoDB)
  if (err.name === 'CastError') {
    return res.status(400).send({
      status: false,
      message: 'Invalid ID format',
    })
  }

  // Error 500 para cualquier otro error imprevisto
  return res.status(500).send({
    status: false,
    message: 'Internal server error',
  })
}

export default errorHandler
