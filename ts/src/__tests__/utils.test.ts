import { Utils } from '../utils'
import { it, expect } from 'vitest'

const { prettyUnit, padZoneStr } = Utils

it('PrettyUnit', () => {
  expect(prettyUnit('day')).toBe('day')
  expect(prettyUnit('quarter')).toBe('quarter')
  expect(prettyUnit('D')).toBe('date')
  expect(prettyUnit('d')).toBe('day')
  expect(prettyUnit('M')).toBe('month')
  expect(prettyUnit('y')).toBe('year')
  expect(prettyUnit('h')).toBe('hour')
  expect(prettyUnit('m')).toBe('minute')
  expect(prettyUnit('s')).toBe('second')
  expect(prettyUnit('ms')).toBe('millisecond')
  expect(prettyUnit('Q')).toBe('quarter')
})

it('PadZoneStr', () => {
  expect(padZoneStr(0 * -1)).toBe('+00:00')
  expect(padZoneStr(1 * 60 * -1)).toBe('-01:00')
  expect(padZoneStr(-1 * 60 * -1)).toBe('+01:00')
  expect(padZoneStr(-10 * 60 * -1)).toBe('+10:00')
  expect(padZoneStr(10 * 60 * -1)).toBe('-10:00')
  expect(padZoneStr((-5 * 60 - 30) * -1)).toBe('+05:30')
})
