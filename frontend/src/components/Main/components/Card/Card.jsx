import { useContext } from "react";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";
import Trash from "../../../../images/Trash.svg";
import activeLike from "../../../../images/active-like.png";
import like from "../../../../images/Group-heart.svg";

export default function Card(props) {
  const { currentUser } = useContext(CurrentUserContext);

  const isOwn =
    props.owner === currentUser._id || props.owner === currentUser.id;

  const cardTrashButtonClassName = `grid-card__button-trash ${
    isOwn ? "grid-card__button-trash_visible" : "grid-card__button-trash_hidden"
  }`;

  const cardLikeButtonClassName = "grid-card__button-like";

  return (
    <div className="grid-card">
      {isOwn && (
        <button
          className={cardTrashButtonClassName}
          type="button"
          onClick={() => props.onConfirmDelete(props._id)}
        >
          <img
            className="grid-card__button-trash-image"
            src={Trash}
            alt="bote de basura"
          />
        </button>
      )}
      <img
        className="grid-card__image"
        src={props.link}
        alt={props.name}
        onClick={props.onCardClick}
      />
      <div className="grid-card__paragraph-and-image">
        <p className="grid-card__paragraph grid-card__paragraph_text_overflow">
          {props.name}
        </p>
        <button
          className={cardLikeButtonClassName}
          type="button"
          onClick={() => props.handleLike(props._id, props.isLiked)}
        >
          <img
            src={props.isLiked ? activeLike : like}
            alt="imagen me-gusta"
            className="grid-card__button-like-image"
          />
        </button>
      </div>
    </div>
  );
}
