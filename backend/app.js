import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { errors } from 'celebrate'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import cardsRouter from './routes/cards.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import auth from './middlewares/auth.js'
import errorHandler from './middlewares/errorHandler.js'
import { requestLogger, errorLogger } from './middlewares/logger.js'

dotenv.config()

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/aroundb',
  ALLOWED_ORIGINS = 'http://localhost:3000',
  NODE_ENV = 'development',
} = process.env

mongoose
  .connect(MONGO_URL)
  .then(() => {
    if (NODE_ENV !== 'test') console.log('MongoDB conectado')
  })
  .catch((err) => {
    console.error('Error conexión Mongo:', err)
    process.exit(1)
  })

const app = express()

const allowedOrigins = new Set(
  ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
)

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) {
        console.log('[CORS] allow (no origin header)')
        return cb(null, true)
      }
      if (allowedOrigins.has(origin)) {
        console.log(`[CORS] allow ${origin}`)
        return cb(null, true)
      }
      console.warn(`[CORS] block ${origin}`)
      return cb(new Error('CORS_NOT_ALLOWED'))
    },
    credentials: true,
  }),
)

app.use((err, req, res, next) => {
  if (err && err.message === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({ message: 'Origin not allowed by CORS' })
  }
  return next(err)
})

app.use(helmet())

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Demasiados intentos. Intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(globalLimiter)

app.use(requestLogger)
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/signin', authLimiter)
app.use('/signup', authLimiter)

app.use(authRouter)
app.use(auth)
app.use(cardsRouter)
app.use(usersRouter)

app.use('/', (req, res) => {
  res.status(404).send({
    message: 'Endpoint not found',
  })
})

app.use(errorLogger)
app.use(errors())
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port  ${PORT}`)
})
