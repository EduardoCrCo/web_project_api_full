export const BASE_URL = "https://api.web-project-around.ignorelist.com";

// export const register = (email, password) => {
//   return fetch(`${BASE_URL}/signup`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // Incluir cookies en la solicitud
//     body: JSON.stringify({ email, password }),
//   }).then(async (res) => {
//     return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
//   });
// };

// export const authorize = (email, password) => {
//   return fetch(`${BASE_URL}/signin`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     credentials: "include", // Incluir cookies en la solicitud
//     body: JSON.stringify({ email, password }),
//   }).then((res) => {
//     return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
//   });
// };

// export const checkToken = (token) => {
//   return fetch(`${BASE_URL}/users/me`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   }).then((res) => {
//     return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
//   });
// };

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ email, password }),
  }).then(async (res) => {
    const data = await res.json();

    if (res.ok) {
      return data;
    }

    // ✅ Devuelve el mensaje real del backend
    const errorMessage = data.message || data.error || `Error: ${res.status}`;
    console.error("❌ Error en registro:", {
      status: res.status,
      message: errorMessage,
      data: data,
    });
    throw new Error(errorMessage);
  });
};

export const authorize = (email, password) => {
  console.log("🔐 authorize() llamado con:", { email, password: "***" });

  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ email, password }),
  }).then(async (res) => {
    console.log("📡 Respuesta del servidor:", res.status, res.statusText);

    const data = await res.json();
    console.log("📦 Data recibida:", data);

    if (res.ok) {
      return data;
    }

    // ✅ Devuelve el mensaje real del backend
    const errorMessage = data.message || data.error || `Error: ${res.status}`;
    console.error("❌ Error en login:", {
      status: res.status,
      message: errorMessage,
      data: data,
    });
    throw new Error(errorMessage);
  });
};
