import Trash from "../../../../images/Trash.svg";
import activeLike from "../../../../images/active-like.png";
import like from "../../../../images/Group-heart.svg";

export default function Card(props) {
  const cardLikeButtonClassName = "grid-card__button-like";

  return (
    <div className="grid-card">
      <button
        className="grid-card__button-trash"
        type="button"
        onClick={() => props.onConfirmDelete(props._id)}
      >
        <img
          className="grid-card__button-trash-image"
          src={Trash}
          alt="bote de basura"
        />
      </button>
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
