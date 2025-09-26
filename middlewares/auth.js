import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const { SECRET_KEY } = process.env

const auth = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ status: false, message: 'Authorization required' })
  }
  try {
    const token = authorization.replace('Bearer ', '')
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    return next()
  } catch (err) {
    return res
      .status(401)
      .send({ status: false, message: 'Authorization required' })
  }
}

export default auth
