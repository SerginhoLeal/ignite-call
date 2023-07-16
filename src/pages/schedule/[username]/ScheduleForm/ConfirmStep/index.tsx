import dayjs from 'dayjs'

import { z } from 'zod'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { CalendarBlank, Clock } from 'phosphor-react'

import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'

import { api } from '@/services'

import { confirmFormSchema } from './schema'
import { ConfirmStepProps } from './interface'

import * as Styles from './styles'

type ConfirmFormData = z.infer<typeof confirmFormSchema>

export function ConfirmStep({ schedulingDate, onCancelConfirmation }: ConfirmStepProps) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  })

  const router = useRouter()
  const username = String(router.query.username)

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

  async function handleConfirmScheduling(data: ConfirmFormData) {
    const { name, email, observations } = data

    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date: schedulingDate,
    })

    onCancelConfirmation()
  }

  return (
    <Styles.ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <Styles.FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </Styles.FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && <Styles.FormError size="sm">{errors.name.message}</Styles.FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput type="email" placeholder="johndoe@example.com" {...register('email')} />
        {errors.email && <Styles.FormError size="sm">{errors.email.message}</Styles.FormError>}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <Styles.FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </Styles.FormActions>
    </Styles.ConfirmForm>
  )
}