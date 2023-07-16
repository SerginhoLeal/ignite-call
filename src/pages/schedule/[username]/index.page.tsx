import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import { Avatar, Heading, Text } from '@ignite-ui/react'

import { prisma } from '@services'

import { Container, UserHeader } from './styles'
import { ScheduleProps } from './interfaces'
import { ScheduleForm } from './ScheduleForm'

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />
      <Container>
        <UserHeader>
          <Avatar src={user.avatarUrl} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // Só quando alguém for entrar no projeto, será gerado a página estatica
    fallback: 'blocking',
  }
}

// getStaticPaths: Quais usuários queremos gerar paginas estaticas dentro da build da nossa aplicação

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}