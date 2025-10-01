import express from 'express'
import mongoose from 'mongoose'
import cors from "cors";
import { errors } from 'celebrate'
import cardsRouter from './routes/cards.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import auth from './middlewares/auth.js'
import errorHandler from './middlewares/errorHandler.js'
import { requestLogger, errorLogger } from './middlewares/logger.js'

mongoose.connect('mongodb://localhost:27017/aroundb')

const app = express()

app.use(cors({
  origin: [
    'http://web-project-around.ignorelist.com',
    'https://web-project-around.ignorelist.com',
    'http://localhost:3000'
  ],
  credentials: true
}));


app.use(requestLogger)

app.use(express.json()) // para parsear application/json
app.use(express.urlencoded({ extended: true }))

app.use(authRouter)

app.use(auth)

app.use(cardsRouter)
app.use(usersRouter)

app.use(errorLogger);
app.use(errors());

app.use('/', (req, res) => {
  res.status(404).send({
    message: 'Endpoint not found',
  })
})


// Middleware de manejo de errores - DEBE IR AL FINAL
app.use(errorHandler)

const port = 3000
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`)
})
