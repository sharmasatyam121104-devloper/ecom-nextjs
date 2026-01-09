import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

interface CustomSessionInterface extends Session {
    user: {
        id: string
        email: string
        name: string
        gender: string
    }
}

interface CustomUserInterface extends User {
    gender: string
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: "Email", name: "email"},
                password: {label: "Password", name: "password"}
            },
            async authorize(credentials) {
                try {
                    const payload = {
                        email: credentials?.email,
                        password: credentials?.password
                    }
                    const {data} = await axios.post(`${process.env.SERVER}/api/user/login`, payload)
                    return data
                }
                catch(error)
                {
                    console.log("AUTHORIZE ERROR:", error)
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({token, user}) {
            const customUser = user as CustomUserInterface

            if(customUser)
            {
                token.id = customUser.id
                token.gender = customUser.gender
            }
            return token
        },
        async session({session, token}) {
            const customSession = session as CustomSessionInterface
            if(token)
            {
                customSession.user.id = token.id as string
                customSession.user.gender = token.gender as string
            }

            return customSession
        }
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}