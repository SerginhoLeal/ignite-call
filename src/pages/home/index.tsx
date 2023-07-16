import { NextSeo } from 'next-seo'
import Image from 'next/image'

import { Heading, Text } from '@ignite-ui/react'

import { ClaimUsernameForm } from './common/ClaimUsernameForm'

import * as Styles from './styles'
import AppPreview from '../../assets/app-preview.png'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />
      <Styles.Container>
        <Styles.Hero>
          <Heading>Agendamento Descomplicado</Heading>
          <Text>
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>
          <ClaimUsernameForm />
        </Styles.Hero>
        <Styles.Preview>
          <Image src={AppPreview} height={400} priority alt="app-preview" />
        </Styles.Preview>
      </Styles.Container>
    </>
  )
}
