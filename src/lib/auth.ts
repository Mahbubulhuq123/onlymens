import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"
import bcrypt from "bcryptjs"
import type { Adapter } from "next-auth/adapters"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Auto-create/validate specific admin credentials requested by user
        if (credentials.email === "admin@onlymen.com.bd" && credentials.password === "Admin@OnlyMen2026!") {
          let admin = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!admin) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            admin = await prisma.user.create({
              data: {
                email: credentials.email,
                name: "Super Admin",
                password: hashedPassword,
                role: "ADMIN",
              }
            });
          }
          
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    }
  }
}
