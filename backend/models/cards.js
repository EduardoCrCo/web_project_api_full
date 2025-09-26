import mongoose from 'mongoose'

const CardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
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
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
})

const Card = mongoose.model('card', CardSchema)

export default Card
