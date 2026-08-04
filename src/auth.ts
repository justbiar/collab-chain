import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import { verifyFarcasterSignIn, resolveFarcasterUsername } from "@/lib/farcaster-auth";
import { farcasterIdentity } from "@/lib/handle";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID,
      clientSecret: process.env.AUTH_TWITTER_SECRET,
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.email ?? null,
          image: profile.data.profile_image_url,
          username: profile.data.username,
        };
      },
    }),
    Credentials({
      id: "farcaster",
      name: "Farcaster",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
        nonce: { label: "Nonce", type: "text" },
      },
      // "Sign in with Farcaster" — client @farcaster/auth-kit ile imzalı bir
      // SIWF mesajı üretir, burada imza doğrulanır ve kullanıcı adı client'a
      // güvenmeden fid'den resmi kayıttan çözülür (bkz. lib/farcaster-auth.ts).
      async authorize(creds) {
        const message = typeof creds?.message === "string" ? creds.message : null;
        const signature =
          typeof creds?.signature === "string" ? (creds.signature as `0x${string}`) : null;
        const nonce = typeof creds?.nonce === "string" ? creds.nonce : null;
        if (!message || !signature || !nonce) return null;

        const verified = await verifyFarcasterSignIn({ message, signature, nonce });
        if (!verified) return null;

        const username = await resolveFarcasterUsername(verified.fid);
        if (!username) return null;

        return {
          id: farcasterIdentity(username),
          username: farcasterIdentity(username),
          name: username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.username) {
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
