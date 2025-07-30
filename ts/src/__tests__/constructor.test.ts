import dayjs from '../index'
import { it, expect } from 'vitest'

it('supports instanceof dayjs', () => {
  expect(dayjs() instanceof dayjs).toBeTruthy()
})

it('does not break isDayjs', () => {
  expect(dayjs.isDayjs(dayjs())).toBeTruthy()
  expect(dayjs.isDayjs(new Date())).toBeFalsy()
})
