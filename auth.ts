import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import type { NextAuthOptions as NextAuthConfig, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { getServerSession } from 'next-auth'

import axios from '@/lib/axios'
import { AdapterUser } from 'next-auth/adapters'

declare module 'next-auth/jwt' {
  interface JWT {
    cartId: number
    userId: number
    token: string
    role: string
  }
}

declare module 'next-auth' {
  interface User {
    userId: number
    cartId: number
    token: string
    role: string
  }
  interface Session {
    user: {
      name: string
      email: string
      image: string
      cartId: number
      userId: number
      token: string
      role: string
    }
  }
}

export const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Missing credentials')
        }
        try {
          const user = await axios
            .post(`/api/users/credentialsLogin`, {
              email: credentials.email,
              password: credentials.password,
            })
            .then((res) => res.data)
          return user
        } catch (err) {
          return null
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, user, trigger, account }) {
      if (trigger === 'signIn' && user) {
        // Google Sign In
        if (account?.provider === 'google') {
          user = await axios
            .post(`/api/users/googleLogin`, {
              name: user.name,
              email: user.email,
              googleId: user.id,
            })
            .then((response) => response.data as User | AdapterUser)
        }
        token.userId = user.userId
        token.cartId = user.cartId
        token.token = user.token
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.userId = token.userId
      session.user.cartId = token.cartId
      session.user.token = token.token
      session.user.role = token.role
      return session
    },
  },
} satisfies NextAuthConfig

export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config)
}
