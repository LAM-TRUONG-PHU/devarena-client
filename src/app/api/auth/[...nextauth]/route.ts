import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider, { GithubEmail } from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import { mainInstance } from "@/app/axios/MainInstance";
import { IUser } from "@/types copy/IUser";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  secret: process.env.NO_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
     
      
      

    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
       
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const payload = {
          "email":credentials?.username,
          "password":credentials?.password,
          "provider":"credentials"
        }
        const user: JWT =await mainInstance.post("/login",payload).then((res)=>{
          return res.data.data
        }).catch((e)=>{
          console.log(e)
        })

        if(user){
          return user as any
        }
        return null;
      },
    }),
    // ...add more providers here
  ],

  callbacks: {

    async jwt({ trigger, token, user, account, profile }) {

      if (trigger === "signIn" ) {
        if(account?.provider!=="credentials"){
          await mainInstance
          .post("/login", {
            email: token.email,
            provider: account?.provider,
            password: "123BDnm", // Mật khẩu giả lập, cần thay thế bằng mật khẩu hợp lệ
          }) 
          .then((response) => {
            console.log("Login Response:", response.data.data);
            token.user = response.data.data;
          })
          .catch((error) => {
            // Xử lý lỗi 401 hoặc các lỗi khác
            if (error.response) {
              console.error("Login Error - Status:", error.response.status);
              console.error("Login Error - Data:", error.response.data);
            } else {
              console.error("Login Error:", error.message);
            }
            throw new Error("Login failed: " + (error.response?.data?.message || error.message));
          });

        }
        else{
          //@ts-ignore
           token.user = user
        }
       
      } 
      if (trigger === "signUp") {
        // Gọi API đăng ký
        mainInstance
          .post("/signup", {
            email: user.email,
            provider: account?.provider,
            password: "123BDnm", // Mật khẩu giả lập, cần thay thế bằng mật khẩu hợp lệ
          })
          .then((response) => {
            console.log("Signup Response:", response.data);
          })
          .catch((error) => {
            // Xử lý lỗi khi đăng ký
            if (error.response) {
              console.error("Signup Error - Status:", error.response.status);
              console.error("Signup Error - Data:", error.response.data);
            } else {
              console.error("Signup Error:", error.message);
            }
            throw new Error("Signup failed: " + (error.response?.data?.message || error.message));
          });
      }
      return token;
    },
    
    
    async session({ session, token }) {
      if (token.user) {
        console.log("session")
        console.log(token.user)
        session.user = token.user;
      }
      return session;
    },

  },
  pages: {
    signIn:"/auth/login",
    error:"/auth/login",
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
 