import CardModel from '../models/cards.js'
import handleFailError from '../utils/handleErrors.js'

const getAllCards = (req, res, next) => {
  CardModel.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards)
    })
    .catch(next)
}

const getCard = (req, res, next) => {
  const { id } = req.params
  CardModel.findById(id)
    .populate(['owner', 'likes'])
    .orFail(handleFailError)
    .then((card) => {
      res.send(card)
    })
    .catch(next)
}

const createCard = (req, res, next) => {
  const { user } = req
  const {
    name, link, likes, createdAt,
  } = req.body
  CardModel.create({
    name,
    link,
    likes,
    createdAt,
    owner: user._id,
  })
    .then((card) => {
      res.send(card)
    })
    .catch(next)
}

const likeCard = (req, res, next) => {
  const { id } = req.params
  CardModel.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .orFail(handleFailError)
    .then((card) => {
      res.send(card)
    })
    .catch(next)
}

const dislikeCard = (req, res, next) => {
  const { id } = req.params
  CardModel.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .orFail(handleFailError)
    .then((card) => {
      res.send(card)
    })
    .catch(next)
}

const deleteCard = (req, res, next) => {
  const { id } = req.params
  const userId = req.user._id

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).send({ message: "ID no válido" });
  // }

  CardModel.findById(id)
    .orFail(handleFailError)
    .then((card) => {
      // Verificar que el usuario es el propietario de la tarjeta
      if (card.owner.equals(userId)) {
        const error = new Error(
          'No tienes permisos para eliminar esta tarjeta',
        )
        error.statusCode = 403
        return next(error)
      }

      // Si es el propietario, eliminar la tarjeta
      return CardModel.findByIdAndDelete(id)
    })
    .then((deletedCard) => {
      if (deletedCard) {
        res.send({ status: true, message: 'Tarjeta eliminada exitosamente' })
      }
    })
    .catch(next)
}

export {
  getAllCards, getCard, createCard, likeCard, dislikeCard, deleteCard,
}
