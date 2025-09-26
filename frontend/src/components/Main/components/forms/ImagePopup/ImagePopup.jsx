export default function ImagePopup(props) {
  return (
    <>
      <img className="popup__image" src={props.link} alt={props.name} />
      <p className="popup__title">{props.name}</p>
    </>
  );
}
