// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: 'profile email',
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (user) {
        session.user.id = token.id;
        session.user.name = user.name ?? "Unknown";
        session.user.image = user.image ?? "";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      console.log("this is the user" , user)
      return token;
    },
    
  },
});


export { handler as GET, handler as POST };
