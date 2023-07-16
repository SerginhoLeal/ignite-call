import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextArea, Avatar } from '@ignite-ui/react'

import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import { Container, Header } from '../styles'

import * as Styles from './styles'
import { api } from '@/services'
import { NextSeo } from 'next-seo'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdateProfileData) {
    await api.put('/users/profile', {
      bio: data.bio,
    })

    await router.push(`/schedule/${session.data?.user.username}`)
  }

  return (
    <>
      <NextSeo title="Atualize seu perfil | Ignite Call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você pode
            editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={4} />
        </Header>

        <Styles.ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text>Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              referrerPolicy="no-referrer"
              alt={session.data?.user.name}
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} />
            <Styles.FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido em sua página pessoal.
            </Styles.FormAnnotation>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Finalizar
            <ArrowRight />
          </Button>
        </Styles.ProfileBox>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  return {
    props: {
      session,
    },
  }
}