import { useRef, useEffect } from "react";
import FormValidator from "../../../../../utils/FormValidator";

export default function NewCard({ onAddPlaceSubmit }) {
  const formRef = useRef();

  useEffect(() => {
    const form = document.querySelector(".form_place");

    const formValidator = new FormValidator(form, {
      formSelector: ".form",
      inputSelector: ".form__input",
      submitButtonSelector: ".form__submit",
      inactiveButtonClass: "button_inactive",
      inputErrorClass: "form__input_type_error",
      errorClass: "form__input-error_active",
    });
    formValidator.enableValidation();
  }, []);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const name = formRef.current.name.value;
    const link = formRef.current.link.value;
    onAddPlaceSubmit({ name, link });
  };

  return (
    <form
      className="form form_place"
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
    >
      <h3 className="edit-profile">Nuevo Lugar</h3>
      <fieldset className="form__fieldset">
        <input
          id="inputTitle"
          type="text"
          name="name"
          className="form__input form__input_title"
          placeholder="Titulo"
          required
          minLength="2"
          maxLength="30"
        />
        <span className="inputTitle-error"></span>
        <input
          id="inputImageUrl"
          type="url"
          name="link"
          className="form__input form__input_url-image"
          placeholder="URL de la imagen"
          required
        />
        <span className="inputImageUrl-error"></span>
      </fieldset>
      <button type="submit" className="form__submit">
        Crear
      </button>
    </form>
  );
}
