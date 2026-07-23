import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";

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
