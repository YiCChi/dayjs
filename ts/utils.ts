import type { DayJS } from '.'
import * as C from './constants'
import type { UnitType, UnitTypeShort } from './types'

export class Utils {
  static padZoneStr(offsetMinutes: number): string {
    const negMinutes = -offsetMinutes
    const minutes = Math.abs(negMinutes)
    const hourOffset = Math.floor(minutes / 60)
    const minuteOffset = minutes % 60
    return `${negMinutes <= 0 ? '+' : '-'}${String(hourOffset).padStart(2, '0')}:${String(minuteOffset).padStart(2, '0')}`
  }

  static monthDiff(a: DayJS, b: DayJS): number {
    // function from moment.js in order to keep the same result
    if (a.date() < b.date()) return -Utils.monthDiff(b, a)
    const wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month())
    const anchor = a.clone().add(wholeMonthDiff, C.M).valueOf()
    const c = b.valueOf() - anchor.valueOf() < 0
    const anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), C.M).valueOf()
    return +(
      -(
        wholeMonthDiff +
        (b.valueOf() - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)
      ) || 0
    )
  }

  static absFloor(n: number): number {
    return n < 0 ? Math.ceil(n) || 0 : Math.floor(n)
  }

  static isUnitTypeShort(u: unknown): u is UnitTypeShort {
    const validUnits: UnitTypeShort[] = [
      'ms',
      's',
      'm',
      'h',
      'd',
      'w',
      'M',
      'Q',
      'y',
      'D'
    ]
    if (typeof u !== 'string' || !validUnits.includes(u as UnitTypeShort))
      return false

    return true
  }
  static prettyUnit(u: UnitTypeShort | UnitType): UnitType {
    const special: Record<UnitTypeShort, UnitType> = {
      ms: 'millisecond',
      s: 'second',
      m: 'minute',
      h: 'hour',
      d: 'day',
      w: 'week',
      M: 'month',
      Q: 'quarter',
      y: 'year',
      D: 'date'
    }

    if (Utils.isUnitTypeShort(u)) return special[u]

    return u
  }

  static offsetFromString(value = ''): number | null {
    const offset = value.match(C.REGEX_VALID_OFFSET_FORMAT)

    if (!offset) {
      return null
    }

    const [indicator, hoursOffset, minutesOffset] = `${offset[0]}`.match(
      C.REGEX_OFFSET_HOURS_MINUTES_FORMAT
    ) || ['-', '0', '0']
    const totalOffsetInMinutes = +hoursOffset * 60 + +minutesOffset

    if (totalOffsetInMinutes === 0) {
      return 0
    }

    return indicator === '+' ? totalOffsetInMinutes : -totalOffsetInMinutes
  }

  /**
   * Reflects the date set method name based on the unit type.
   * @param unit - The unit type (short or full).
   * @param utc - Whether to use UTC methods. @default false.
   * @returns The corresponding Date method name.
   */
  static reflectDateSetMethodName(
    unit: UnitTypeShort | UnitType,
    utc = false
  ) {
    const utcPad = utc ? 'UTC' : ''
    const map = {
      millisecond: `set${utcPad}Milliseconds`,
      second: `set${utcPad}Seconds`,
      minute: `set${utcPad}Minutes`,
      hour: `set${utcPad}Hours`,
      day: `set${utcPad}Date`,
      week: `set${utcPad}Date`,
      month: `set${utcPad}Month`,
      quarter: `set${utcPad}Month`,
      year: `set${utcPad}FullYear`,
      date: `set${utcPad}Date`,
    } as const

    return map[Utils.prettyUnit(unit)]
  }
}
