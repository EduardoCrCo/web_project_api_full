import { useState, useContext, useEffect } from "react";
import Card from "./components/Card/Card";
import EditAvatar from "./components/forms/EditAvatar/EditAvatar.jsx";
import EditProfile from "./components/forms/EditProfile/EditProfile";
import NewCard from "./components/forms/NewCard/NewCard";
import RemoveCard from "./components/forms/RemoveCard/RemoveCard";
import Popup from "./components/Popup/Popup";
import ProfileAvatarImage from "../../images/authorAvatar.jpg";
import EditProfileAvatarImage from "../../images/editProfileImage.svg";
import EditButtonImage from "../../images/edit-button.svg";
import AddImageButton from "../../images/Vector_plus.svg";
import ImagePopup from "./components/forms/ImagePopup/ImagePopup";
import api from "../../utils/api.js";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

export default function Main({ popupType, setPopupType, handlePopupClose }) {
  const [cards, setCards] = useState([]);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(() => {
    api.getCards().then((newCards) => {
      setCards(newCards);
    });
  }, []);

  const handleAddPlaceSubmit = ({ name, link }) => {
    api.addCard(name, link).then((card) => {
      setCards([card, ...cards]);
      handlePopupClose();
    });
  };

  const handleLike = (cardId, isLiked) => {
    if (isLiked) {
      api.deleteLikeCard(cardId).then((card) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? card : currentCard
          )
        );
      });
    } else {
      api.likeCard(cardId).then((card) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? card : currentCard
          )
        );
      });
    }
  };

  const handleDeleteCard = (cardId) => {
    api.deleteCard(cardId).then(() => {
      setCards((state) => state.filter((card) => card._id !== cardId));
      setCardToDelete(null);
    });
  };

  const userContext = useContext(CurrentUserContext);
  const { currentUser } = userContext;
  const [selectedCard, setSelectedCard] = useState(null);

  const avatarPopupTypes = {
    children: <EditAvatar />,
  };

  const profilePopupTypes = {
    children: <EditProfile />,
  };

  const newCardPopupTypes = {
    children: <NewCard onAddPlaceSubmit={handleAddPlaceSubmit} />,
  };

  return (
    <>
      <main className="content">
        <section className="profile">
          <div className="profile-avatar">
            <img
              src={currentUser.avatar}
              alt="imagen del perfil"
              className="profile-avatar__image"
            />
            <img
              src={EditProfileAvatarImage}
              onClick={() => setPopupType(avatarPopupTypes)}
              alt="icono de editar imagen de perfil"
              className="profile-avatar__edit_icon"
            />
          </div>

          <div className="profile-info">
            <div className="profile-info__name-and-button">
              <p className="profile-info__name profile-info__name_text_overflow">
                {currentUser.name}
              </p>
              <button
                className="profile-info__edit-button"
                onClick={() => setPopupType(profilePopupTypes)}
              >
                <img
                  src={EditButtonImage}
                  alt="boton de editar informacion del perfil"
                  className="profile-info__edit-button-image"
                />
              </button>
            </div>
            <p className="profile-info__about profile-info__about_text_overflow">
              {currentUser.about}
            </p>
          </div>

          <button
            className="profile__add-button"
            type="button"
            onClick={() => setPopupType(newCardPopupTypes)}
          >
            <img
              src={AddImageButton}
              alt="boton de agregar imagen"
              className="profile__add-button-image"
            />
          </button>
        </section>

        <section className="elements">
          <div className="grid">
            {cards.map((card) => (
              <Card
                key={card._id}
                handleLike={handleLike}
                onConfirmDelete={(_id) => setCardToDelete(_id)}
                onCardClick={() => {
                  setSelectedCard(card);
                }}
                name={card.name}
                link={card.link}
                isLiked={card.isLiked}
                _id={card._id}
              />
            ))}
          </div>
        </section>
      </main>
      {popupType && (
        <Popup onClose={handlePopupClose} title={popupType.title}>
          {popupType.children}
        </Popup>
      )}
      {selectedCard && (
        <Popup
          onClose={() => setSelectedCard(null)}
          customClassName="popup__body_image"
        >
          <ImagePopup name={selectedCard.name} link={selectedCard.link} />
        </Popup>
      )}
      {cardToDelete && (
        <Popup onClose={() => setCardToDelete(null)}>
          <RemoveCard onConfirm={() => handleDeleteCard(cardToDelete)} />
        </Popup>
      )}
    </>
  );
}
