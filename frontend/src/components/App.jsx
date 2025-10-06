import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

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

  const handleRegistration = (email, password) => {
    auth
      .register(email, password)
      .then(() => {
        setInfoTooltipMessage("¡Correcto! Ya estás registrado.");
        setIsTooltipSuccess(true);
        setIsInfoTooltipOpen(true);
      })
      .catch((err) => {
        console.error("Error en registro:", err);
        setInfoTooltipMessage(
          "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo."
        );
        setIsTooltipSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleLogin = (email, password) => {
    console.log("🔐 Iniciando login para:", email);

    auth
      .authorize(email, password)
      .then((data) => {
        console.log("✅ Respuesta del servidor:", data);

        if (data.token) {
          console.log("💾 Guardando token...");
          localStorage.setItem("jwt", data.token);
          setEmail(email);
          setIsLoggedIn(true);

          console.log("👤 Obteniendo datos del usuario...");
          return api.getUserInfo();
        } else {
          throw new Error("No se recibió token del servidor");
        }
      })
      .then((user) => {
        console.log("✅ Usuario obtenido:", user);
        setCurrentUser(user);
        setIsInfoTooltipOpen(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("❌ Error en el login:", error);
        setIsLoggedIn(false);
        setCurrentUser({});
        setEmail(null);
        localStorage.removeItem("jwt");

        showErrorTooltip(
          error.message || "Usuario no encontrado o contraseña incorrecta"
        );
      });
  };

  const handleTooltipClose = () => {
    setIsInfoTooltipOpen(false);
    if (isTooltipSuccess) {
      navigate("/login");
    }
  };

  const handlePopupClose = () => {
    setPopupType(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      console.log("🔍 Token encontrado, validando...");

      api
        .getUserInfo()
        .then((data) => {
          console.log("✅ Token válido, usuario cargado:", data);
          setCurrentUser(data);
          setEmail(data.email);
          setIsLoggedIn(true);
          // ✅ NO navegar aquí - causa loop infinito
        })
        .catch((err) => {
          console.error("❌ Token inválido o expirado:", err.message);
          setIsLoggedIn(false);
          setCurrentUser({});
          setEmail(null);
          localStorage.removeItem("jwt");

          // Solo redirigir si no estamos en login/register
          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && currentPath !== "/register") {
            navigate("/login");
          }
        });
    } else {
      console.log("ℹ️ No hay token - usuario no autenticado");
    }
  }, [navigate]);

  const handleUpdateUser = (data) => {
    api
      .updateUser(data.name, data.about)
      .then((newData) => {
        setCurrentUser(newData);
        handlePopupClose();
      })
      .catch((err) => {
        console.error("Error updating user info:", err);
      });
  };

  const handleUpdateAvatar = (avatar) => {
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
    console.log("👋 Cerrando sesión...");
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
