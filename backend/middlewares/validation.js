import { celebrate, Joi } from 'celebrate'
import validator from 'validator'

// validacion personalizada de URLs
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value
  }
  return helpers.error('string.uri')
}

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().custom(validateURL).required(),
  }),
})

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
})

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateURL).required(),
  }),
})

const validateRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
})

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
})

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(validateURL).required(),
  }),
})

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(), // ObjectId de MongoDB
  }),
})

export {
  validateUser,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateRegister,
  validateLogin,
  validateCard,
  validateId,
}
