import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";
import FormValidator from "../../../../../utils/FormValidator";

export default function EditProfile() {
  useEffect(() => {
    const form = document.querySelector(".form_profile");
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

  const userContext = useContext(CurrentUserContext);
  const { currentUser, handleUpdateUser } = userContext;

  const [name, setName] = useState(currentUser.name);
  const [about, setAbout] = useState(currentUser.about);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAboutChange = (event) => {
    setAbout(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUpdateUser({ name, about });
  };

  return (
    <form className="form form_profile" noValidate onSubmit={handleSubmit}>
      <h3 className="edit-profile">Editar perfil</h3>
      <fieldset className="form__fieldset">
        <input
          type="text"
          name="name"
          id="input-name"
          className="form__input form__input-name"
          placeholder="Nombre"
          required
          onChange={handleNameChange}
          minLength="2"
          maxLength="40"
          value={name}
        />
        <span className="input-name-error"></span>
        <input
          id="input-About"
          type="text"
          name="about"
          className="form__input form__input-about"
          placeholder="Acerca de mi"
          required
          onChange={handleAboutChange}
          minLength="2"
          maxLength="200"
          value={about}
        />
        <span className="input-About-error"></span>
      </fieldset>
      <button type="submit" className="form__submit">
        Guardar
      </button>
    </form>
  );
}
