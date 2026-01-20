// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string 
            email?: string | null
            name?: string | null
            image?: string | null
            role?: string | null
            address?: {
                mobile: string
                street: string
                area: string
                city: string
                state: string
                pincode: string
            }
        }
    }

    interface User {
        id: string
        role: string
        address: {
                mobile: string
                street: string
                area: string
                city: string
                state: string
                pincode: string
            }
    }
}