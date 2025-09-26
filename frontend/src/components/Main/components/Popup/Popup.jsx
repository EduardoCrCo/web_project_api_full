import { useEffect } from "react";

export default function Popup(props) {
  const { children, onClose, customClassName } = props;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup__overlay")) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div className="popup popup_opened">
      <div className="popup__overlay" onClick={handleOverlayClick}></div>
      <div className="popup__content">
        <div className={`popup__body ${customClassName}`}>
          <button className="popup__close-button" onClick={onClose}>
            X
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
