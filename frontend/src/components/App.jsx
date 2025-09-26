import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import Main from "./Main/Main.jsx";
import { useState } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/api.js";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import * as auth from "../utils/auth.js";
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
        navigate("/login");
      })
      .catch(() => {
        setInfoTooltipMessage(
          "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo."
        );
        setIsTooltipSuccess(false);
        setIsInfoTooltipOpen(true);
      });
  };

  const handleTooltipClose = () => {
    setIsInfoTooltipOpen(false);
    navigate("/login"); // Redirige cuando el usuario cierra el modal
  };

  const handlePopupClose = () => {
    setPopupType(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      fetch("https://se-register-api.en.tripleten-services.com/v1/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
        )
        .then((data) => {
          setIsLoggedIn(true);
          setEmail(data.data.email);
          navigate("/");
        })
        .catch((err) => {
          console.error("Token validation error:", err);
        });
    }
  }, [navigate]);

  useEffect(() => {
    api.getUserInfo().then((user) => {
      setCurrentUser(user);
    });
  }, [isLoggedIn]);

  const handleUpdateUser = (data) => {
    (async () => {
      await api.updateUser(data.name, data.about).then((newData) => {
        setCurrentUser(newData);
        handlePopupClose();
      });
    })();
  };

  const handleUpdateAvatar = (avatar) => {
    api.updateAvatar(avatar).then((user) => {
      setCurrentUser(user);
      handlePopupClose();
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    const token = localStorage.getItem("jwt");
    fetch("https://se-register-api.en.tripleten-services.com/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        setEmail(data.data.email);
      });

    // Puedes agregar más lógica aquí si lo necesitas
  };

  const showErrorTooltip = (message) => {
    setInfoTooltipMessage(message);
    setIsTooltipSuccess(false); // Es un error
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
