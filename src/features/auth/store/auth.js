import axios from "axios";
import { createStore } from "vuex";

export default createStore({
  namespaced: true,
  state: {
    userId: localStorage.getItem("userId") || null,
    token: localStorage.getItem("token") || null, // Store token for authentication
  },
  mutations: {
    setUser(state, payload) {
      state.userId = payload.userId;
      state.token = payload.token;
      localStorage.setItem("token", state.token);
      localStorage.setItem("userId", state.userId);
    },
    clearUser(state) {
      state.userId = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
  actions: {
    async login({ commit }, credentials) {
      // Call the login API, and commit token and userId on success
      try {
        const response = await axios.post("/api/auth/login", credentials);
        const { token } = response.data;
        const profile = await axios.get("/profile");
        const userId = profile.data._id;

        commit("setUser", { token, userId });
      } catch (error) {
        console.error("Login failed:", error);
        throw new Error("Invalid credentials or server error.");
      }
    },
    logout({ commit }) {
      commit("clearUser");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token, // Boolean indicating authentication
  },
});
