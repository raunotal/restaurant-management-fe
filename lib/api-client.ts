import axios from "axios";
import { auth } from "./auth-config";
import { getSession } from "next-auth/react";

const getDefaultUrl = () => {
  console.log("getDefaultUrl", process.env.NEXT_PUBLIC_API_BASE_URL);
  return "http://localhost:5000/api/v1"
}

export const API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || getDefaultUrl(),
});

API.interceptors.request.use(
  async (config) => {
    const session =
      typeof window === "undefined" ? await auth() : await getSession();
    const accessToken = session?.access_token;
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);
