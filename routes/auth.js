import { Router } from 'express'
import { login, register } from '../controllers/users.js'
import { validateRegister, validateLogin } from '../middlewares/validation.js'

const router = Router()

router.post('/signin', validateLogin, login)
router.post('/signup', validateRegister, register)

export default router
