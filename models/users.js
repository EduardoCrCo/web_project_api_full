import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(http|https):\/{2}[._~:\/?%#\]@!$&'()*+,;=A-Za-z0-9\-]+/.test(
          v,
        )
      },
      message: (props) => `${props.value} is not a valid http address`,
    },
    default: 'https://example.com/default-avatar.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return /^((?!\.)[\w\-_.]*[^.])(@[\w-]+)(\.[\w-]+(\.[\w-]+)?[^.\W])$/.test(
          v,
        )
      },
      message: (props) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // para que al hacer consultas no se devuelva el password
  },
})

const User = mongoose.model('user', UserSchema)

export default User
