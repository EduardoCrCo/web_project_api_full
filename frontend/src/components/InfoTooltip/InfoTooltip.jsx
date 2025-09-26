import "../../../src/blocks/InfoTooltip.css";
import Union from "../../images/Union.png";
import UnionFail from "../../images/UnionFail.png";
import Popup from "../Main/components/Popup/Popup.jsx";
import "../../blocks/popup.css";

const InfoTooltip = ({ isOpen, onClose, message, isSuccess }) => {
  if (!isOpen) return null;
  return (
    <Popup onClose={onClose} customClassName="info-tooltip">
      <img
        className="info-tooltip__image"
        src={isSuccess ? Union : UnionFail}
        alt={isSuccess ? "Success" : "Error"}
      />
      <p className="info-tooltip__message">{message}</p>
    </Popup>
  );
};

export default InfoTooltip;
