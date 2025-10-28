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


import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/db/prisma";
import { compare } from "bcrypt-ts-edge";
// import {cookies} from 'next/headers';
import { NextResponse } from "next/server";

function deriveRoleFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim().toLowerCase();
  return local || "user";
}

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
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const { email, password } = credentials;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        const role = user.role ?? deriveRoleFromEmail(user.email);

        // debug
        if (process.env.NODE_ENV !== "production") {
          console.log("🟢 [authorize] role resolved:", role);
        }

        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? token.role ?? "user";
        if (process.env.NODE_ENV !== "production") {
          console.log("🟣 [jwt] after sign-in:", token);
        }

        // normalize NO_NAME -> email local-part, persist once
        if (token.name === "NO_NAME" && token.email) {
          token.name = token.email.split("@")[0];
          try {
            if (token.sub) {
              await prisma.user.update({
                where: { id: token.sub },
                data: { name: token.name },
              });
            }
          } catch {
            /* ignore */
          }
        }
      }

      // fallback if role missing
      if (!token.role && token.email) {
        token.role = deriveRoleFromEmail(token.email);
      }
      return token;

    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ request, auth }:any) {
      // check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // Generate a new cart ID and set it as a cookie
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request:{
            headers: newRequestHeaders
          }
        });
        response.cookies.set('sessionCartId', sessionCartId, {
          httpOnly: true,
        });
        return response;
      } else {
        return true;
      }
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "user";
        session.user.name = token.name ?? session.user.name ?? null;
      }
      if (process.env.NODE_ENV !== "production") {
        console.log("🟡 [session] session.user.role:", session.user.role);
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
