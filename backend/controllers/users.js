import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/users.js'
import handleFailError from '../utils/handleErrors.js'

dotenv.config()

const { SECRET_KEY } = process.env

const getAllUsers = (req, res, next) => {
  UserModel.find()
    .then((users) => {
      res.send(users)
    })
    .catch(next)
}

const getUsers = (req, res, next) => {
  const { id } = req.params
  UserModel.findById(id)
    .orFail(handleFailError)
    .then((user) => {
      res.send(user)
    })
    .catch(next)
}

const createUsers = (req, res, next) => {
  const { name, about, avatar } = req.body
  UserModel.create({ name, about, avatar })
    .then((user) => {
      res.send(user)
    })
    .catch(next)
}

const updateUsersProfile = (req, res, next) => {
  const { name, about } = req.body
  UserModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch(next)
}

const updateUsersAvatar = (req, res, next) => {
  const { avatar } = req.body
  UserModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch(next)
}

const register = (req, res, next) => {
  const { email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  UserModel.create({ email, password: hashedPassword })
    .then((user) => {
      res.send({ status: true, email: user.email })
    })
    .catch(next)
}

const login = (req, res, next) => {
  const { email, password } = req.body
  UserModel.findOne({ email })
    .select('+password')
    .orFail(handleFailError)
    .then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
          expiresIn: '7d',
        })
        res.json({ token })
      } else {
        const error = new Error('Invalid email or password')
        error.statusCode = 401
        next(error)
      }
    })
    .catch(next)
}

const me = (req, res, next) => {
  const { _id } = req.user
  UserModel.findById(_id)
    .then((user) => {
      res.send(user)
    })
    .catch(next)
}

export {
  getAllUsers,
  getUsers,
  createUsers,
  updateUsersProfile,
  updateUsersAvatar,
  register,
  login,
  me,
}
