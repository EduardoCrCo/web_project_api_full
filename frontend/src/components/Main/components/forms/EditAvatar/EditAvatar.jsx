import { useContext, useRef, useEffect } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";
import FormValidator from "../../../../../utils/FormValidator";

export default function EditAvatar() {
  const formRef = useRef();
  const userContext = useContext(CurrentUserContext);
  const { handleUpdateAvatar } = userContext;

  useEffect(() => {
    const form = document.querySelector(".form_avatar");
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const avatar = formRef.current.link.value;
    handleUpdateAvatar(avatar);
  };

  return (
    <form
      className="form form_avatar"
      onSubmit={handleSubmit}
      ref={formRef}
      noValidate
    >
      <h3 className="edit-profile">Cambiar foto de perfil</h3>
      <input
        id="inputAvatarUrl"
        type="url"
        name="link"
        className="form__input form__input_url-image"
        placeholder="URL de la imagen"
        required
      />
      <span className="inputAvatarUrl-error"></span>
      <button type="submit" className="form__submit">
        Guardar
      </button>
    </form>
  );
}
