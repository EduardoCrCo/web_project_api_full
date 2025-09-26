import { Router } from 'express'
import auth from '../middlewares/auth.js'
import {
  getAllCards,
  getCard,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
} from '../controllers/cards.js'
import { validateId, validateCard } from '../middlewares/validation.js'

const router = Router()

router.get('/cards', getAllCards)
router.get('/cards/:id', validateId, getCard)
router.post('/cards', validateCard, auth, createCard)
router.put('/cards/:id/likes', validateId, auth, likeCard)
router.delete('/cards/:id/likes', validateId, auth, dislikeCard)
router.delete('/cards/:id', validateId, auth, deleteCard)

export default router
