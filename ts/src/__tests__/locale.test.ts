import moment from 'moment'
import dayjs from '../index'
import { zhCn } from '../locales'
import { it, expect, describe, vi, test } from 'vitest'

const format = 'dddd D, MMMM'

it('Uses spanish locale through constructor', () => {
  expect(dayjs('2018-4-28', { locale: zhCn }).format(format)).toBe(
    '星期六 28, 四月'
  )
})

it('set locale for one instance only', () => {
  expect(dayjs('2018-4-28').format(format)).toBe('土曜日 28, 4月')

  expect(dayjs('2018-4-28').locale(zhCn).format(format)).toBe('星期六 28, 四月')

  expect(dayjs('2018-4-28', { locale: 'en' }).format(format)).toBe(
    'Saturday 28, April'
  )
})

it('get instance locale name', () => {
  expect(dayjs().locale()).toBe('ja')
  expect(dayjs().locale('en').locale()).toBe(moment().locale())
  expect(dayjs().locale('en').locale()).toBe('en')
  expect(dayjs().locale('zh-cn').locale()).toBe(
    moment().locale('zh-cn').locale()
  )
})

it('immutable instance locale', () => {
  const origin = dayjs('2018-4-28')
  expect(origin.format(format)).toBe('土曜日 28, 4月')
  expect(origin.locale('en').format(format)).toBe('Saturday 28, April')
  const changed = origin.locale('en')
  expect(changed.format(format)).toBe('Saturday 28, April')
  expect(origin.format(format)).toBe('土曜日 28, 4月')
})

it('User custom locale', () => {
  const date = dayjs('2018-4-28').locale({
    name: 'xx',
    ordinal: (n: number): string => `${n}th`,
    formats: {
      LT: 'h:mm A',
      LTS: 'h:mm:ss A',
      L: 'YYYY-MM-DD',
      LL: 'MMMM D, YYYY',
      LLL: 'MMMM D, YYYY h:mm A',
      LLLL: 'dddd, MMMM D, YYYY h:mm A'
    },
    meridiem: () => '',
    relativeTime: {
      M: '1 month',
      MM: '%d months',
      d: '1 day',
      dd: '%d days',
      y: '1 year',
      yy: '%d years',
      h: '1 hour',
      hh: '%d hours',
      m: '1 minute',
      mm: '%d minutes',
      s: '1 second',
      future: 'in %s',
      past: '%s ago'
    },
    weekdays: Array(7).fill('week'),
    months: Array(12).fill('month')
  })
  expect(date.format(format)).toBe('week 28, month')
  expect(date.locale()).toBe('xx')
})

describe('Instance locale inheritance', () => {
  const zhDayjs = dayjs('2018-4-28').locale(zhCn)

  it('Clone', () => {
    expect(zhDayjs.clone().format(format)).toBe('星期六 28, 四月')
    expect(dayjs(zhDayjs).format(format)).toBe('星期六 28, 四月')
  })

  it('StartOf EndOf', () => {
    expect(zhDayjs.startOf('year').format(format)).toBe('星期一 1, 一月')
    expect(zhDayjs.endOf('day').format(format)).toBe('星期六 28, 四月')
  })

  it('Set', () => {
    expect(zhDayjs.set('year', 2017).format(format)).toBe('星期五 28, 四月')
  })

  it('Add', () => {
    expect(zhDayjs.add(1, 'year').format(format)).toBe('星期日 28, 四月')
    expect(zhDayjs.add(1, 'month').format(format)).toBe('星期一 28, 五月')
    expect(zhDayjs.add(1, 'minute').format(format)).toBe('星期六 28, 四月')
  })
})

test('use locale through dayjs.locale', () => {
  vi.useFakeTimers({ now: new Date('2024-01-01T00:00:00Z') })

  expect(dayjs.locale('en').format('YYYY-MM-DD')).toBe('2024-01-01')
  expect(dayjs.locale('zh-cn').format('YYYY-MMM-DD')).toBe('2024-1月-01')

  vi.useRealTimers()
})
