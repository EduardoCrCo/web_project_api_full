import { useState } from "react";
import "../../../src/blocks/login.css";
import { Link, useNavigate } from "react-router-dom";
import { authorize } from "../../utils/auth.js";

const Login = ({ onLogin, showErrorTooltip }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authorize(data.email, data.password)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        onLogin();
        navigate("/");
      })
      .catch(() => {
        showErrorTooltip(
          "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo."
        );
      });
  };

  return (
    <div className="login-container">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__form-title">Inicia sesión</h2>
        <fieldset className="login__form-fieldset">
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
            type="password"
            id="password"
            name="password"
            className="form__input form__input-password"
            placeholder="Contraseña"
            value={data.password}
            onChange={handleChange}
            required
          />
        </fieldset>
        <button className="login__form-submit_button" type="submit">
          Inicia sesión
        </button>
      </form>
      <p className="login__form-footer login__form-footer-link">
        ¿Aún no eres miembro?<Link to="/register"> Regístrate Aquí</Link>
      </p>
    </div>
  );
};

export default Login;
