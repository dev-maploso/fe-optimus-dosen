import { api } from "./api";

export const AuthService = {
  login(email: string, password: string) {
    return api.post("/login", { email, password });
  },

  logout() {
    return api.post("/logout");
  }
};
