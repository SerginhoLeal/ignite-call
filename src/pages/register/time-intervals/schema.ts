import { z } from 'zod'
import { convertTimeStringToMinutes } from '@/utils'

export const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana',
    })
    .transform((intervals) =>
      intervals.map((interval) => ({
        weekDay: interval.weekDay,
        startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
        endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
      })),
    )
    .refine(
      (intervals) =>
        intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        ),
      {
        message:
          'O horário de término deve ser pelo menos 1h distante do início.',
      },
    ),
})

export const Intervals = [
  { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
  { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
  { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
  { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
  { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
  { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
  { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
]
