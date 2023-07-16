import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ArrowRight } from 'phosphor-react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { z } from 'zod'

import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'

import { getWeekDays } from '@/utils'
import { api } from '@services'

import { Container, Header } from '../styles'

import * as Styles from './styles'

import { timeIntervalsFormSchema, Intervals } from './schema'

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: { intervals: Intervals },
  })

  const weekDays = getWeekDays()
  const intervals = watch('intervals')
  const router = useRouter()

  const { fields } = useFieldArray({ control, name: 'intervals' })

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput

    await api.post('/users/time-intervals', { intervals })

    await router.push('/register/update-profile')
  }

  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Ignite Call" noindex />
      <Container>
        <Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horário que você está disponível em cada dia
            da semana.
          </Text>

          <MultiStep size={4} currentStep={3} />
        </Header>

        <Styles.IntervalBox
          as="form"
          onSubmit={handleSubmit(handleSetTimeIntervals)}
        >
          <Styles.IntervalContainer>
            {fields.map((field, index) => (
              <Styles.IntervalItem key={field.id}>
                <Styles.IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        checked={field.value}
                      />
                    )}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </Styles.IntervalDay>
                <Styles.IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </Styles.IntervalInputs>
              </Styles.IntervalItem>
            ))}
          </Styles.IntervalContainer>

          {errors.intervals && (
            <Styles.FormError size="sm">
              {errors.intervals.message}
            </Styles.FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Styles.IntervalBox>
      </Container>
    </>
  )
}
