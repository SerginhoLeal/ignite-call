import { NextApiRequest, NextApiResponse, NextPageContext } from 'next'
import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { destroyCookie, parseCookies } from 'nookies'

export function PrismaAdapter(
  request: NextApiRequest | NextPageContext['req'],
  response: NextApiResponse | NextPageContext['res'],
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req: request })

      if (!userIdOnCookies) {
        throw new Error('User ID not found on cookies.')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      destroyCookie({ res: response }, '@ignitecall:userId', { path: '/' })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user){
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user){
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account= await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account){
        return null
      }

      const { user } = account;

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async updateUser({ id, name, email, avatar_url }) {
      const prismaUser = await prisma.user.update({
        where: {
          id: id!,
        },
        data: { name, email, avatar_url }
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
      }
    },

    async linkAccount({
      userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
    }) {
      await prisma.account.create({
        data: {
          user_id: userId,
          type,
          provider,
          provider_account_id: providerAccountId,
          refresh_token,
          access_token,
          expires_at,
          token_type,
          scope,
          id_token,
          session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken,
        },
      })

      return {
        userId,
        sessionToken,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const PSession = await prisma.session.findUnique({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!PSession) {
        return null;
      };

      const { user, ...session } = PSession;

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatar_url: user.avatar_url!,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken,
        },
      })
    },
  }
}