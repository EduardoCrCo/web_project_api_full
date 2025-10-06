class Api {
  constructor(url, token) {
    this._url = url;
    //this._token = token;
  }

  _getToken() {
    const token = localStorage.getItem("jwt");
    return token ? `Bearer ${token}` : null;
  }

  getUserInfo() {
    return this._makeRequest("users/me");
  }

  getCards() {
    return this._makeRequest("cards");
  }

  updateUser(name, about) {
    return this._makeRequest("users/me", "PATCH", { name, about });
  }

  addCard(name, link) {
    return this._makeRequest("cards", "POST", { name, link });
  }

  deleteCard(cardId) {
    return this._makeRequest(`cards/${cardId}`, "DELETE");
  }

  updateAvatar(avatar) {
    return this._makeRequest("users/me/avatar", "PATCH", { avatar });
  }

  likeCard(cardId) {
    return this._makeRequest(`cards/${cardId}/likes`, "PUT");
  }

  deleteLikeCard(cardId) {
    return this._makeRequest(`cards/${cardId}/likes`, "DELETE");
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getCards()]);
  }

  _makeRequest(path, method = "GET", body = {}) {
    // if (!this._token) {
    //   // true (undefined)
    //   return Promise.reject(new Error("Authentication token is missing."));
    //   // Todas las peticiones fallan
    // }

    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        //Authorization: this._token,
      },
    };

    const token = this._getToken();
    if (token) {
      config.headers.Authorization = token;
    } else {
      return Promise.reject(new Error("Authentication token is missing."));
    }

    if (method !== "GET" && method !== "DELETE") {
      config["body"] = JSON.stringify(body);
    }
    return fetch(`${this._url}${path}`, config).then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      const json = await res.json();
      throw new Error(json.message);
    });
  }
}

const api = new Api(
  "https://api.web-project-around.ignorelist.com/"
  //localStorage.getItem("jwt") ? `Bearer ${localStorage.getItem("jwt")}` : null
);

export default api;
