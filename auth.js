import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            authorize: async (credentials) => {
                const user = { password: process.env.ADMIN_PASSWORD };
                if (credentials.password === user.password) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
    trustHost: true,
});
