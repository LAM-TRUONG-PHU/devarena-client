import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider, { GithubEmail } from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import { JWT } from "next-auth/jwt";
import { mainInstance } from "@/axios/MainInstance";

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
        const data: JWT =await mainInstance.post("auth/login",payload).then((res)=>{
          return res.data.data
        }).catch((err)=>{
          console.log(err)
          if (err.response.status === 401) {
            throw new Error("Invalid username or password");
        } else if (err.response.status === 400) {
            throw new Error("Account not verified");
        }        })

        if(data){
          return data as any
        }
        return null;
      },
    }),
    // ...add more providers here
  ],

  callbacks: {
    async jwt({ trigger, token, user, account, profile }) {
      // throw new Error("Invalid provider or credentials");

      if (trigger === "signIn" ) {
        if(account?.provider!=="credentials"){
          await mainInstance
          .post("/auth/login", {
            email: token.email,
            provider: account?.provider,
            password: "123BDnm", // Mật khẩu giả lập, cần thay thế bằng mật khẩu hợp lệ
          }) 
          .then((response) => {
            console.log("Login Response:", response.data.data);
            token.user = response.data.data;
          })
          .catch((error) => {
            let e=""
            if (error.response?.status === 401) {
              // throw new Error("Invalid provider or credentials");
              e="Invalid provider or credentials"
            } else if (error.response?.status === 404) {
              e="Providers not found"
            } 
            token.error = e
          });

        }
        else{
           // @ts-ignore
        token.access_token = user.access_token;
        // @ts-ignore

        token.refresh_token = user.refresh_token;
        // @ts-ignore

        token.user = user.user;
          
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
      if(trigger==="update"){
        token.error=''
      }
      return token;
    },
    
    
    async session({ session, token }) {
      if (token.error) {
        console.log("session error")

        console.log(token.error)
        session.error = token.error; // Pass the error to the session object
      }
      if (token.user) { 
        session.user = token.user;
        session.access_token=token.access_token;
        session.refresh_token=token.refresh_token;
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
 