// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { User } from "next-auth";

declare module "next-auth" {
  interface User {
    access_token?: string;
  }

  interface Session {
    access_token?: string;
  }
}
