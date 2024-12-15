import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider, { GithubEmail } from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";

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
      authorization: {
        url: "https://github.com/login/oauth/authorize",
        params: { scope: "read:user user:email" },
      },
      token: "https://github.com/login/oauth/access_token",
      userinfo: {
        url: "https://api.github.com/user",
        async request({ client, tokens }) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const profile = await client.userinfo(tokens.access_token!)
          
          if (!profile.email) {
            // If the user does not have a public email, get another via the GitHub API
            // See https://docs.github.com/en/rest/users/emails#list-email-addresses-for-the-authenticated-user
            const res = await fetch("https://api.github.com/user/emails", {
              headers: { Authorization: `token ${tokens.access_token}` },
            })
  
            if (res.ok) {
              const emails: GithubEmail[] = await res.json()
              profile.email = (emails.find((e) => e.primary) ?? emails[0]).email
            }
          }
          console.log(tokens)
          return profile
        },
      },
      
      

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
        // Here, you can validate the credentials and fetch the user data
        if (credentials?.username === "admin" && credentials?.password === "password") {
          const user = {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
          };
          return user;
        }

        // If the credentials are invalid, return null
        return null;
      },
    }),
    // ...add more providers here
  ],

  callbacks: {
    async jwt({ trigger, token, user, account, profile }) {
      console.log("jwt")
      if (trigger === "signIn" && user) {
        console.log(token)
        console.log(user)
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
