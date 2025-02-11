import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email User.Read",
        },
      },
    }),
  ],
  callbacks: {
    signIn({ profile, user, account }) {
      if (!profile) {
        return false;
      }
      user.access_token = account?.id_token;
      return profile.email?.endsWith("@augustresto.ee") || false;
    },
    jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
      }
      return token;
    },
    session({ session, token }) {
      session.access_token = token.access_token as string;
      return session;
    },
    authorized({ auth }) {
      return !!auth;
    },
  },
});
