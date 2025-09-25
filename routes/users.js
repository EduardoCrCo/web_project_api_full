import { Router } from 'express'
import auth from '../middlewares/auth.js'
import {
  getAllUsers,
  getUsers,
  createUsers,
  updateUsersProfile,
  updateUsersAvatar,
  me,
} from '../controllers/users.js'
import {
  validateUser,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateId,
} from '../middlewares/validation.js'

const router = Router()

router.get('/users', getAllUsers)
router.get('/users/me', auth, me)
router.get('/users/:id', validateId, getUsers)
router.post('/users', validateUser, createUsers)
router.patch('/users/me', validateUpdateProfile, auth, updateUsersProfile)
router.patch('/users/me/avatar', validateUpdateAvatar, auth, updateUsersAvatar)

export default router
