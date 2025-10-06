import { useState, useEffect } from "react";
import {
  //BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import CurrentUserContext from "../contexts/CurrentUserContext.js";
import * as auth from "../utils/auth.js";
import api from "../utils/api.js";

import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import Main from "./Main/Main.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [popupType, setPopupType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [infoTooltipMessage, setInfoTooltipMessage] = useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isTooltipSuccess, setIsTooltipSuccess] = useState(true);
  const [email, setEmail] = useState(null);
  //const [token, setToken] = useState(null);

  const handleRegistration = (email, password) => {
    auth
      .register(email, password)
      .then(() => {
        setInfoTooltipMessage("¡Correcto! Ya estás registrado.");
        setIsTooltipSuccess(true);
        setIsInfoTooltipOpen(true);
      })
      .catch(() => {
        setInfoTooltipMessage(
          "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo."
        );
        setIsTooltipSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleLogin = (email, password) => {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setEmail(email);
          setIsLoggedIn(true);

          return api.getUserInfo(); // ✅ Leer datos del usuario
        }
      })
      .then((user) => {
        setCurrentUser(user);

        navigate("/");
      })
      .catch((error) => {
        console.error("Error en el login:", error);
        setIsLoggedIn(false);
        showErrorTooltip("Usuario no encontrado o no registrado");
        localStorage.removeItem("jwt");
      });
  };

  const handleTooltipClose = () => {
    setIsInfoTooltipOpen(false);
    if (isTooltipSuccess) {
      navigate("/login"); // Redirige cuando el usuario cierra el modal
    }
  };

  const handlePopupClose = () => {
    setPopupType(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      api
        .getUserInfo() // ✅ Lee token automáticamente
        .then((data) => {
          setCurrentUser(data);
          setEmail(data.email);
          setIsLoggedIn(true);
          navigate("/");
        })
        .catch((err) => {
          console.error("Token validation error:", err);
          setIsLoggedIn(false);
          localStorage.removeItem("jwt");
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleUpdateUser = (data) => {
    // const token = localStorage.getItem("jwt");
    // (async () => {
    //   await
    api
      .updateUser(data.name, data.about)
      .then((newData) => {
        setCurrentUser(newData);
        handlePopupClose();
      })
      .catch((err) => {
        console.error("Error updating user info:", err);
      });
    //})();
  };

  const handleUpdateAvatar = (avatar) => {
    // const token = localStorage.getItem("jwt");
    api
      .updateAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        handlePopupClose();
      })
      .catch((err) => {
        console.error("Error updating avatar:", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser({});
    setEmail(null);
    navigate("/login");
  };

  const showErrorTooltip = (message) => {
    setInfoTooltipMessage(message);
    setIsTooltipSuccess(false);
    setIsInfoTooltipOpen(true);
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, handleUpdateUser, handleUpdateAvatar }}
    >
      <div className="page">
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={handleTooltipClose}
          message={infoTooltipMessage}
          isSuccess={isTooltipSuccess}
        />
        <Header
          className="header header_main"
          handleLogout={handleLogout}
          currentUser={currentUser}
          email={email}
          isLoggedIn={isLoggedIn}
        />
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                showErrorTooltip={showErrorTooltip}
              />
            }
          />
          <Route
            path="/register"
            element={<Register handleRegistration={handleRegistration} />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Main
                  setPopupType={setPopupType}
                  popupType={popupType}
                  handlePopupClose={handlePopupClose}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
