import { useState } from "react";
import "../../../src/blocks/register.css";
import { Link } from "react-router-dom";

const Register = ({ handleRegistration }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(data.email, data.password);
  };

  return (
    <div className="register-container">
      <form className="register__form" onSubmit={handleSubmit}>
        <h2 className="register__form-title">Regístrate</h2>
        <fieldset className="register__form-fieldset">
          <input
            id="email"
            name="email"
            type="email"
            className="form__input form__input-email"
            placeholder="Correo electrónico"
            value={data.email}
            onChange={handleChange}
            required
          />
          <input
            id="password"
            name="password"
            type="password"
            className="form__input form__input-password"
            placeholder="Contraseña"
            value={data.password}
            onChange={handleChange}
            required
          />
        </fieldset>
        <button className="register__form-submit_button" type="submit">
          Regístrate
        </button>
      </form>
      <p className="register__form-footer register__form-footer-link">
        ¿Ya eres miembro?<Link to="/login"> Inicia sesión Aquí</Link>
      </p>
    </div>
  );
};

export default Register;
