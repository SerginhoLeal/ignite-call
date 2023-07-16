import { useState, useMemo } from 'react'
import { CaretLeft, CaretRight } from 'phosphor-react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

import { useQuery } from '@tanstack/react-query'
import { getWeekDays } from '@utils'
import * as Styles from './styles'

import { CalendarProps, CalendarWeek } from './interface'
import { api } from '@/services'

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()
  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = String(router.query.username)

  function handlePreviousMonth() {
    const previousMonth = currentDate.subtract(1, 'month')

    setCurrentDate(previousMonth)
  }

  function handleNextMonth() {
    const nextMonth = currentDate.add(1, 'month')

    setCurrentDate(nextMonth)
  }

  const { data: blockedDates } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month') + 1,
        },
      })

      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
      // daysInMonth: quantos dias eu tenho no mês.
    }).map((_, i) => currentDate.set('date', i + 1))

    // date: dia: 1/2/3/4
    // day: dia da semana: seg/ter/qua/qui/sex
    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({ length: firstWeekDay})
      .map((_, i) => currentDate.subtract(i + 1, 'day'))
      .reverse()

    const lastDayInCurrentMonth = currentDate.set('date',currentDate.daysInMonth())
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({ length: 7 - (lastWeekDay + 1) })
      .map((_, i) => lastDayInCurrentMonth.add(i + 1, 'day'))

    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({ date, disabled: true })),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => ({ date, disabled: true })),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <Styles.CalendarContainer>
      <Styles.CalendarHeader>
        <Styles.CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </Styles.CalendarTitle>

        <Styles.CalendarActions>
          <button onClick={handlePreviousMonth} title="Previous month">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Next month">
            <CaretRight />
          </button>
        </Styles.CalendarActions>
      </Styles.CalendarHeader>

      <Styles.CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => (
              <th key={weekDay}>{weekDay}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <Styles.CalendarDay onClick={() => onDateSelected(date.toDate())} disabled={disabled}>
                        {date.get('date')}
                      </Styles.CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </Styles.CalendarBody>
    </Styles.CalendarContainer>
  )
}