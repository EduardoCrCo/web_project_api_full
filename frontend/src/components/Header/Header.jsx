import Logo from "../../images/logo.svg";
import Line from "../../images/Line.svg";
import { Link, useLocation } from "react-router-dom";
import "../../../src/blocks/header.css";

export default function Header({
  currentUser,
  handleLogout,
  email,
  isLoggedIn,
}) {
  const location = useLocation();

  return (
    <header
      className={`header${
        isLoggedIn && location.pathname === "/" ? " header_main" : ""
      }`}
    >
      <div className="header__spacer">
        <img
          src={Logo}
          alt="imagen vectorial de encabezado"
          className="header__image"
        />
        <div className="header__spacer-email">
          {isLoggedIn && currentUser._id ? (
            <>
              <a className="header__link-email">{email} </a>
              <a className="header__link-close" onClick={handleLogout}>
                Cerrar sesión
              </a>
            </>
          ) : (
            <>
              {location.pathname === "/register" && (
                <Link className="header__link" to="/login">
                  Inicia sesión
                </Link>
              )}
              {location.pathname === "/login" && (
                <Link className="header__link" to="/register">
                  Regístrate
                </Link>
              )}
            </>
          )}
          <div className="header__divider"></div>
        </div>
      </div>
      <img src={Line} alt="Line" className="header__image-line" />
    </header>
  );
}
