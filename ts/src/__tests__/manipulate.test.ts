import MockDate from 'mockdate'
import moment from 'moment'
import dayjs from '../index'
import { it, expect, describe, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  MockDate.set(new Date())
})

afterEach(() => {
  MockDate.reset()
})

describe('StartOf EndOf', () => {
  it('StartOf EndOf Year ... with s and upper case', () => {
    const testArr = [
      'year',
      'month',
      'day',
      'date',
      'week',
      'hour',
      'minute',
      'second'
    ] as const
    testArr.forEach((d) => {
      expect(dayjs().startOf(d).valueOf()).toBe(moment().startOf(d).valueOf())
      expect(dayjs().endOf(d).valueOf()).toBe(moment().endOf(d).valueOf())
    })
  })

  it('StartOf week with locale', () => {
    const testDate = [
      undefined,
      '2019-02-10',
      '2019-02-11',
      '2019-02-12',
      '2019-02-13',
      '2019-02-14',
      '2019-02-15',
      '2019-02-16'
    ]
    const testLocale = ['zh-cn', 'en'] as const
    testDate.forEach((d) => {
      testLocale.forEach((l) => {
        expect(dayjs(d).locale(l).startOf('week').date()).toBe(
          moment(d).locale(l).startOf('week').date()
        )
        expect(dayjs(d).locale(l).endOf('week').date()).toBe(
          moment(d).locale(l).endOf('week').date()
        )
      })
    })
  })
})

it('Add Time days', () => {
  expect(dayjs().add(1, 'millisecond').valueOf()).toBe(
    moment().add(1, 'ms').valueOf()
  )
  expect(dayjs().add(1, 'second').valueOf()).toBe(
    moment().add(1, 's').valueOf()
  )
  expect(dayjs().add(1, 'minute').valueOf()).toBe(
    moment().add(1, 'm').valueOf()
  )
  expect(dayjs().add(1, 'hour').valueOf()).toBe(moment().add(1, 'h').valueOf())
  expect(dayjs().add(1, 'week').valueOf()).toBe(moment().add(1, 'w').valueOf())
  expect(dayjs().add(1, 'day').valueOf()).toBe(
    moment().add(1, 'days').valueOf()
  )
  expect(dayjs().add(1, 'month').valueOf()).toBe(moment().add(1, 'M').valueOf())
  expect(dayjs().add(1, 'year').valueOf()).toBe(moment().add(1, 'y').valueOf())
  expect(dayjs('20111031').add(1, 'month').valueOf()).toBe(
    moment('20111031').add(1, 'months').valueOf()
  )
  expect(dayjs('20160131').add(1, 'month').valueOf()).toBe(
    moment('20160131').add(1, 'months').valueOf()
  )
  expect(dayjs('20160229').add(1, 'year').valueOf()).toBe(
    moment('20160229').add(1, 'year').valueOf()
  )

  expect(dayjs().add(2, 'year').valueOf()).toBe(
    moment().add('2', 'years').valueOf()
  )
})

it('Add Time with decimal', () => {
  expect(dayjs().add(0.4, 'day').valueOf()).toBe(
    moment().add(0.4, 'day').valueOf()
  )
  expect(dayjs().add(0.5, 'day').valueOf()).toBe(
    moment().add(0.5, 'day').valueOf()
  )
  expect(dayjs().add(0.4, 'week').valueOf()).toBe(
    moment().add(0.4, 'week').valueOf()
  )
  expect(dayjs().add(0.5, 'week').valueOf()).toBe(
    moment().add(0.5, 'week').valueOf()
  )
})

it('Subtract Time days', () => {
  expect(dayjs().subtract(1, 'day').valueOf()).toBe(
    moment().subtract(1, 'days').valueOf()
  )
})
