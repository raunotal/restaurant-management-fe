import axios from "axios";
import { auth } from "./auth-config";
import { getAccessToken } from "./auth-token";

const getDefaultUrl = () => {
  return "https://uvn-67-207.tll01.zonevs.eu/api/v1";
};

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || getDefaultUrl(),
});

API.interceptors.request.use(
  async (config) => {
    // On the server, use NextAuth's auth() helper
    if (typeof window === "undefined") {
      const session = await auth();
      const accessToken = session?.access_token;
      if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return config;
    }

    // On the client, reuse the access token that was synced from SessionProvider
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);
