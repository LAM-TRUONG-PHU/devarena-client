import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { IUser } from "./IUser";

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** OpenID ID Token */
        access_token: string;
        refresh_token: string;
        user: IUser;
    }
}
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        access_token: string;
        refresh_token: string;
        user: IUser;
        error: string;
    }
}
