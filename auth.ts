// import{PrismaAdapter} from "@auth/prisma-adapter";
// import NextAuth from "next-auth";
// import {prisma} from "@/db/prisma";
// import CredentialsProvider from "next-auth/providers/credentials";
// import credentials from "next-auth/providers/credentials";
// import { compareSync } from "bcrypt-ts-edge";
// import type   NextAuthConfig  from "next-auth";


// export const config = {
//     pages:{
//         signIn: '/sign-in',
//         error: '/sign-in',
//     },
//     session:{
//         strategy: "jwt",
//         maxAge: 30 * 24 * 60 * 60, // 30 days
//     },
//     adapter: PrismaAdapter(prisma),
//     providers:[
//         CredentialsProvider({
//             email:{type:'email'},
//             password:{type:'password'},
//         }),

//         async authorize(credentials){
//             if(credentials == null) return null;

//             //Find User in Database 
//             const user  = await prisma.user.findFirst({
//                 where:{
//                     email: credentials.email as string,
//                 },
//             }); 

//             // Check if user exists and password matches
//             if (user && user.password){
//                 const isMatch = compareSync(credentials.password as string, user.password);

//                 if(isMatch){
//                     return {
//                         id: user.id,
//                         name: user.name,
//                         email: user.email,
//                         role: user.role,
//                     }}
//                 }
//             }

//             // If no user found or password doesn't match
//             return null;
//             }
            
//         }
//     ],

//     callbacks:{
//         async session({session, token, user,trigger}){

//             // Set the user id from token to session
          
//                 session.user.id = token.sub;

//                 // if there is an update , set the username 
//                 if (trigger === 'update'){
//                     session.user.name = user.name;
//                 }

           
//             return session;
//         }
//     }
// } satisfies NextAuthConfig;
// export const {handlers, auth, signIn,signOut} = NextAuth(config)

// auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/db/prisma";
import { compare } from "bcrypt-ts-edge";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ✅ TS-safe narrowing (string টাইপ না হলে reject)
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const { email, password } = credentials;

        // ✅ email: string — এখন Prisma-তে পাঠানো যাবে
        const user = await prisma.user.findFirst({ // findUnique - better
          where: { email },
        });
        if (!user || !user.password) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          // role: user.role as any, // চাইলে যোগ করুন (session টাইপ augment করলে)
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        
        session.user.id = token.sub;
      }
      return session;
    },
  },

};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
