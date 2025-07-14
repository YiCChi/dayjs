import * as C from './constants'
import { Utils } from './utils'
import type { UnitType, UnitTypeShort } from './types'
import { locales } from './locales'
import type { Locales, ILocale } from './locales'

export type DateInput = Config['date'] | DayJS

export type Config = {
  date?: Date | string | number | null
  locale?: Locales | ILocale
  utc?: boolean
  offset?: number
}

export interface RelativeTimeThreshold {
  l: keyof ILocale['relativeTime']
  r?: number
  d?: Exclude<UnitType, 'week'>
}

const IS_DAYJS = Symbol('isDayjsObject')

export class DayJS {
  private static readonly DEFAULT_LOCALE = 'ja'
  private readonly [IS_DAYJS] = true
  private _locale: ILocale
  private _utc: boolean
  private _offset?: number
  private _localOffset?: number
  private _date: Date

  // utc in
  constructor(config: Config = {}) {
    this._locale = DayJS.parseLocale(config.locale)
    this._utc = config.utc ?? false
    this._offset = config.offset
    this._date = DayJS.parseDateInput(config)
  }

  // ! helper
  static parseLocale(configLocale: Config['locale']) {
    if (configLocale === undefined) {
      return locales[DayJS.DEFAULT_LOCALE]
    } else if (typeof configLocale === 'string') {
      return locales[configLocale]
    } else {
      return configLocale
    }
  }

  // ! helper
  private static parseDateInput(config: Config): Date {
    const { date, utc } = config

    if (date === null) return new Date(NaN)
    if (date === undefined) return new Date()
    if (date instanceof Date) return new Date(date)
    if (typeof date === 'string') {
      if (!/Z$/i.test(date)) {
        const match = date.match(C.REGEX_PARSE)
        if (match) {
          const [_, _year, _month, _day, _hour, _minute, _second, _ms] = match
          const year = Number(_year)
          const month = _month === undefined ? 0 : Number(_month) - 1
          const day = _day === undefined ? 1 : Number(_day)
          const hour = _hour === undefined ? 0 : Number(_hour)
          const minute = _minute === undefined ? 0 : Number(_minute)
          const second = _second === undefined ? 0 : Number(_second)
          const ms = _ms ? Number(_ms.substring(0, 3)) : 0

          if (utc) {
            return new Date(
              Date.UTC(year, month, day, hour, minute, second, ms)
            )
          }
          return new Date(year, month, day, hour, minute, second, ms)
        }
      }
    }

    return new Date(date)
  }

  private wrapper(date: DateInput): DayJS {
    return dayjs(date, {
      locale: this._locale,
      utc: this._utc,
      offset: this._offset
    })
  }

  isValid(): boolean {
    return !(this._date.toString() === C.INVALID_DATE_STRING)
  }

  isSame(that: DateInput, units?: UnitType): boolean {
    const other = dayjs(that)
    return (
      this.startOf(units).valueOf() <= other.valueOf() &&
      other.valueOf() <= this.endOf(units).valueOf()
    )
  }

  isAfter(that: DateInput, units?: UnitType): boolean {
    return dayjs(that) < this.startOf(units)
  }

  isBefore(that: DateInput, units?: UnitType): boolean {
    return this.endOf(units) < dayjs(that)
  }

  unix(): number {
    return Math.floor(this.valueOf() / 1000)
  }

  // modified by utc plugin
  valueOf(): number {
    const addedOffset = !(this._offset === undefined)
      ? this._offset + (this._localOffset ?? this._date.getTimezoneOffset())
      : 0
    return this._date.valueOf() - addedOffset * C.MILLISECONDS_A_MINUTE
  }

  startOf(units?: UnitTypeShort | UnitType): DayJS {
    const unit = units === undefined ? undefined : Utils.prettyUnit(units)

    switch (unit) {
      case 'year':
        return this.wrapper(
          this._utc ? Date.UTC(this.year(), 0, 1) : new Date(this.year(), 0, 1)
        )
      case 'month':
        return this.wrapper(
          this._utc
            ? Date.UTC(this.year(), this.month(), 1)
            : new Date(this.year(), this.month(), 1)
        )
      case 'week': {
        const weekStart = this._locale.weekStart ?? 0
        const gap =
          (this.day() < weekStart ? this.day() + 7 : this.day()) - weekStart
        return this.wrapper(
          this._utc
            ? Date.UTC(this.year(), this.month(), this.date() - gap)
            : new Date(this.year(), this.month(), this.date() - gap)
        )
      }
      case 'day':
      case 'date':
        return this.wrapper(
          this.toDate()[Utils.reflectDateSetMethodName('hour', this._utc)](
            0,
            0,
            0,
            0
          )
        )
      case 'hour':
        return this.wrapper(
          this.toDate()[Utils.reflectDateSetMethodName('minute', this._utc)](
            0,
            0,
            0
          )
        )
      case 'minute':
        return this.wrapper(
          this.toDate()[Utils.reflectDateSetMethodName('second', this._utc)](
            0,
            0
          )
        )
      case 'second':
        return this.wrapper(
          this.toDate()[Utils.reflectDateSetMethodName('ms', this._utc)](0)
        )
      default:
        return this.clone()
    }
  }

  endOf(units?: UnitTypeShort | UnitType): DayJS {
    const unit = units === undefined ? undefined : Utils.prettyUnit(units)

    switch (unit) {
      case 'year':
        return this.wrapper(
          this._utc
            ? Date.UTC(this.year(), 11, 31, 23, 59, 59, 999)
            : new Date(this.year(), 11, 31, 23, 59, 59, 999)
        )
      case 'month':
        return this.wrapper(
          this._utc
            ? Date.UTC(this.year(), this.month() + 1, 0, 23, 59, 59, 999)
            : new Date(this.year(), this.month() + 1, 0, 23, 59, 59, 999)
        )
      case 'week': {
        const weekStart = this._locale.weekStart ?? 0
        const gap =
          (this.day() < weekStart ? this.day() + 7 : this.day()) - weekStart
        return this.wrapper(
          this._utc
            ? Date.UTC(
                this.year(),
                this.month(),
                this.date() + (6 - gap),
                23,
                59,
                59,
                999
              )
            : new Date(
                this.year(),
                this.month(),
                this.date() + (6 - gap),
                23,
                59,
                59,
                999
              )
        )
      }
      case 'day':
      case 'date':
        return this.wrapper(
          this.toDate()[Utils.reflectDateSetMethodName('hour', this._utc)](
            23,
            59,
            59,
            999
          )
        )
      case 'hour':
        return this.wrapper(
          this.toDate()[Utils.reflectDateSetMethodName('minute', this._utc)](
            59,
            59,
            999
          )
        )
      case 'minute':
        return this.wrapper(
          this.toDate()[Utils.reflectDateSetMethodName('second', this._utc)](
            59,
            999
          )
        )
      case 'second':
        return this.wrapper(
          this.toDate()[Utils.reflectDateSetMethodName('ms', this._utc)](999)
        )
      default:
        return this.clone()
    }
  }

  set(
    unit:
      | Exclude<UnitType, 'week' | 'quarter'>
      | Exclude<UnitTypeShort, 'w' | 'Q'>,
    value: number
  ): DayJS {
    const newInstance = this.clone()
    const u = Utils.prettyUnit(unit) as Exclude<UnitType, 'week' | 'quarter'>
    const setMethod = Utils.reflectDateSetMethodName(u, this._utc)

    if (u === 'month' || u === 'year') {
      // there is a risk of date overflow, so we need to set the date to 1 first
      newInstance._date[Utils.reflectDateSetMethodName('date', this._utc)](1)
      newInstance._date[setMethod](value)
      newInstance._date[Utils.reflectDateSetMethodName('date', this._utc)](
        Math.min(this.date(), newInstance.daysInMonth())
      )
    } else {
      const arg = u === 'day' ? this.date() + (value - this.day()) : value
      newInstance._date[setMethod](arg)
    }
    return this.wrapper(newInstance._date)
  }

  get(
    unit:
      | Exclude<UnitType, 'week' | 'quarter'>
      | Exclude<UnitTypeShort, 'w' | 'Q'>
  ): number {
    const key = Utils.prettyUnit(unit) as Exclude<UnitType, 'week' | 'quarter'>

    switch (key) {
      case 'year':
        return this.year()
      case 'month':
        return this.month()
      case 'day':
        return this.day()
      case 'date':
        return this.date()
      case 'hour':
        return this.hour()
      case 'minute':
        return this.minute()
      case 'second':
        return this.second()
      case 'millisecond':
        return this.millisecond()
    }
  }

  add(
    value: number,
    unit: Exclude<UnitType, 'quarter' | 'date'> = 'millisecond'
  ): DayJS {
    if (unit === 'month') {
      return this.set('month', this.month() + value)
    }
    if (unit === 'year') {
      return this.set('year', this.year() + value)
    }
    if (unit === 'day') {
      return this.set('date', this.date() + Math.round(value))
    }
    if (unit === 'week') {
      return this.set('date', this.date() + Math.round(value * 7))
    }

    const step = {
      millisecond: 1,
      minute: C.MILLISECONDS_A_MINUTE,
      hour: C.MILLISECONDS_A_HOUR,
      second: C.MILLISECONDS_A_SECOND
    }

    const nextTimeStamp = this._date.getTime() + value * step[unit]
    return this.wrapper(nextTimeStamp)
  }

  subtract(value: number, unit: Exclude<UnitType, 'quarter' | 'date'>): DayJS {
    return this.add(value * -1, unit)
  }

  format(formatStr?: string): string {
    if (!this.isValid()) return C.INVALID_DATE_STRING

    //add by utc plugin
    const str =
      formatStr ?? (this._utc ? C.UTC_FORMAT_DEFAULT : C.FORMAT_DEFAULT)
    const zoneStr = this.utcOffset() ? Utils.padZoneStr(this.utcOffset()) : 'Z'

    const matches = (match: string) => {
      switch (match) {
        case 'YY':
          return String(this.year()).slice(-2)
        case 'YYYY':
          return String(this.year()).padStart(4, '0')
        case 'M':
          return String(this.month() + 1)
        case 'MM':
          return String(this.month() + 1).padStart(2, '0')
        case 'MMM':
          return (
            this._locale.monthsShort?.[this.month()] ??
            this._locale.months[this.month()].slice(0, 3)
          )
        case 'MMMM':
          return this._locale.months[this.month()]
        case 'D':
          return String(this.date())
        case 'DD':
          return String(this.date()).padStart(2, '0')
        case 'd':
          return String(this.day())
        case 'dd':
          return (
            this._locale.weekdaysMin?.[this.day()] ??
            this._locale.weekdays[this.day()].slice(0, 2)
          )
        case 'ddd':
          return (
            this._locale.weekdaysShort?.[this.day()] ??
            this._locale.weekdays[this.day()].slice(0, 3)
          )
        case 'dddd':
          return this._locale.weekdays[this.day()]
        case 'H':
          return String(this.hour())
        case 'HH':
          return String(this.hour()).padStart(2, '0')
        case 'h':
          return String(this.hour() % 12 === 0 ? 12 : this.hour() % 12)
        case 'hh':
          return String(
            this.hour() % 12 === 0 ? 12 : this.hour() % 12
          ).padStart(2, '0')
        case 'a':
          return this._locale.meridiem(this.hour(), this.minute(), true)
        case 'A':
          return this._locale.meridiem(this.hour(), this.minute(), false)
        case 'm':
          return String(this.minute())
        case 'mm':
          return String(this.minute()).padStart(2, '0')
        case 's':
          return String(this.second())
        case 'ss':
          return String(this.second()).padStart(2, '0')
        case 'SSS':
          return String(this.millisecond()).padStart(3, '0')
        case 'Z':
          return zoneStr
        default:
          return null
      }
    }

    return str.replace(
      C.REGEX_FORMAT,
      (match, $1) => $1 || matches(match) || zoneStr.replace(':', '')
    )
  }

  utcOffset(): number
  // add by utc plugin
  utcOffset(offset: number | string, keepLocalTime?: boolean): DayJS
  utcOffset(input?: number | string, keepLocalTime?: boolean): number | DayJS {
    if (input === undefined) {
      if (this._utc) return 0
      if (this._offset !== undefined) return this._offset
      // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
      // https://github.com/moment/moment/pull/1871
      return -Math.round(this._date.getTimezoneOffset() / 15) * 15
    } else {
      const inputOffset =
        typeof input === 'number' ? input : Utils.offsetFromString(input)
      if (inputOffset === null) return this

      const offset =
        Math.abs(inputOffset) <= 16 ? inputOffset * 60 : inputOffset
      let that = this.clone()
      if (keepLocalTime) {
        that._offset = offset
        that._utc = input === 0
      }
      if (input !== 0) {
        const localTimezoneOffset = this._utc
          ? this.toDate().getTimezoneOffset()
          : -1 * this.utcOffset()
        that = this.local().add(offset + localTimezoneOffset, 'minute')
        that._offset = offset
        that._localOffset = localTimezoneOffset
      } else {
        that = this.utc()
      }
      return that
    }
  }

  // modified by utc plugin
  diff(input?: DateInput, units?: UnitType, float?: boolean): number {
    if (input && input instanceof DayJS && this._utc === input._utc) {
      return this._diff(input, units, float)
    }
    return this.local()._diff(dayjs(input).local(), units, float)
  }

  private _diff(
    input?: DateInput,
    units: UnitType = 'millisecond',
    float?: boolean
  ): number {
    const unit = Utils.prettyUnit(units)
    const that = dayjs(input)
    const zoneDelta =
      (that.utcOffset() - this.utcOffset()) * C.MILLISECONDS_A_MINUTE
    const diff = this.valueOf() - that.valueOf()

    let result: number
    switch (unit) {
      case 'year':
        result = Utils.monthDiff(this, that) / 12
        break
      case 'quarter':
        result = Utils.monthDiff(this, that) / 3
        break
      case 'month':
        result = Utils.monthDiff(this, that)
        break
      case 'week':
        result = (diff - zoneDelta) / C.MILLISECONDS_A_WEEK
        break
      case 'day':
        result = (diff - zoneDelta) / C.MILLISECONDS_A_DAY
        break
      case 'hour':
        result = diff / C.MILLISECONDS_A_HOUR
        break
      case 'minute':
        result = diff / C.MILLISECONDS_A_MINUTE
        break
      case 'second':
        result = diff / C.MILLISECONDS_A_SECOND
        break
      default:
        result = diff
        break
    }

    return float ? result : Utils.absFloor(result)
  }

  daysInMonth(): number {
    if (this.month() === 1) {
      return (this.year() % 4 === 0 && this.year() % 100 !== 0) ||
        this.year() % 400 === 0
        ? 29
        : 28
    }
    const map = {
      '1': 31,
      '3': 31,
      '4': 30,
      '5': 31,
      '6': 30,
      '7': 31,
      '8': 31,
      '9': 30,
      '10': 31,
      '11': 30,
      '12': 31
    }

    return map[String(this.month() + 1) as keyof typeof map]
  }

  locale(preset?: Locales | ILocale): DayJS {
    const ins = this.clone()
    if (preset) {
      ins._locale = DayJS.parseLocale(preset)
    }

    return ins
  }

  clone(): DayJS {
    return this.wrapper(this._date)
  }

  // modified by utc plugin
  toDate(type?: 's'): Date {
    if (type === 's' && this._offset) {
      return dayjs(this.format('YYYY-MM-DD HH:mm:ss:SSS')).toDate()
    }
    return new Date(this.valueOf())
  }

  toJSON(): string | null {
    return this.isValid() ? this.toISOString() : null
  }

  // modified by utc plugin
  toISOString(): string {
    return this.toDate().toISOString()
  }

  // modified by utc plugin
  toString(): string {
    return this.toDate().toUTCString()
  }

  millisecond(): number
  millisecond(value: number): DayJS
  millisecond(value?: number) {
    return value === undefined
      ? this._utc
        ? this._date.getUTCMilliseconds()
        : this._date.getMilliseconds()
      : this.set('millisecond', value)
  }

  second(): number
  second(value: number): DayJS
  second(value?: number) {
    return value === undefined
      ? this._utc
        ? this._date.getUTCSeconds()
        : this._date.getSeconds()
      : this.set('second', value)
  }

  minute(): number
  minute(value: number): DayJS
  minute(value?: number) {
    return value === undefined
      ? this._utc
        ? this._date.getUTCMinutes()
        : this._date.getMinutes()
      : this.set('minute', value)
  }

  hour(): number
  hour(value: number): DayJS
  hour(value?: number) {
    return value === undefined
      ? this._utc
        ? this._date.getUTCHours()
        : this._date.getHours()
      : this.set('hour', value)
  }

  /**
   * Get the day of the week (0-6, where 0 is Sunday).
   */
  day(): number
  day(value: number): DayJS
  day(value?: number) {
    return value === undefined
      ? this._utc
        ? this._date.getUTCDay()
        : this._date.getDay()
      : this.set('day', value)
  }

  /**
   * Get the day of the month (1-31).
   */
  date(): number
  date(value: number): DayJS
  date(value?: number) {
    return value === undefined
      ? this._utc
        ? this._date.getUTCDate()
        : this._date.getDate()
      : this.set('date', value)
  }

  month(): number
  month(value: number): DayJS
  month(value?: number) {
    return value === undefined
      ? this._utc
        ? this._date.getUTCMonth()
        : this._date.getMonth()
      : this.set('month', value)
  }

  year(): number
  year(value: number): DayJS
  year(value?: number) {
    return value === undefined
      ? this._utc
        ? this._date.getUTCFullYear()
        : this._date.getFullYear()
      : this.set('year', value)
  }

  // ----------------------------------------------------
  // plugins

  // utc plugin --- start ---
  utc(keepLocalTime?: boolean): DayJS {
    const ins = new DayJS({
      date: this.toDate(),
      locale: this._locale,
      utc: true
    })
    return keepLocalTime ? ins.add(this.utcOffset(), 'minute') : ins
  }

  local(): DayJS {
    return new DayJS({ date: this.toDate(), locale: this._locale, utc: false })
  }

  isUTC(): boolean {
    return !!this._utc
  }
  // utc plugin --- end ---

  // RelativeTime plugin --- start ---
  private fromToBase(
    input: DateInput,
    withoutSuffix: boolean,
    isFrom: boolean,
    postFormat?: (s: string) => string
  ): string {
    const loc = this._locale.relativeTime

    const thresholds: RelativeTimeThreshold[] = [
      { l: 's', r: 44, d: 'second' },
      { l: 'm', r: 89 },
      { l: 'mm', r: 44, d: 'minute' },
      { l: 'h', r: 89 },
      { l: 'hh', r: 21, d: 'hour' },
      { l: 'd', r: 35 },
      { l: 'dd', r: 25, d: 'day' },
      { l: 'M', r: 45 },
      { l: 'MM', r: 10, d: 'month' },
      { l: 'y', r: 17 },
      { l: 'yy', d: 'year' }
    ]

    let result: number = 0
    let out = ''
    let isFuture: boolean

    for (let i = 0; i < thresholds.length; i++) {
      const t = thresholds[i]
      if (t.d) {
        result = isFrom
          ? dayjs(input).diff(this.toDate(), t.d, true)
          : this.diff(input, t.d, true)
      }
      const abs = Math.round(Math.abs(result))
      isFuture = result > 0

      if (!t.r || abs <= t.r) {
        const format = loc[abs <= 1 && i > 0 ? thresholds[i - 1].l : t.l]
        out = format.replace('%d', postFormat?.(String(abs)) ?? String(abs))
        break
      }
    }

    if (withoutSuffix) return out

    const pastOrFuture = isFuture! ? loc.future : loc.past
    return pastOrFuture.replace('%s', out)
  }

  to(input: DateInput, withoutSuffix?: boolean): string {
    return this.fromToBase(input, !!withoutSuffix, true)
  }

  from(input: DateInput, withoutSuffix?: boolean): string {
    return this.fromToBase(input, !!withoutSuffix, false)
  }

  toNow(withoutSuffix?: boolean): string {
    return this.to(this._utc ? dayjs.utc() : dayjs(), withoutSuffix)
  }

  fromNow(withoutSuffix?: boolean): string {
    return this.from(this._utc ? dayjs.utc() : dayjs(), withoutSuffix)
  }
  // RelativeTime plugin --- end ---

  // minMax plugin --- start ---
  static max(...dates: (DayJS | DayJS[])[]): DayJS | null {
    return DayJS.sortBy('isAfter', dates.flat())
  }

  static min(...dates: (DayJS | DayJS[])[]): DayJS | null {
    return DayJS.sortBy('isBefore', dates.flat())
  }

  private static sortBy(
    method: 'isAfter' | 'isBefore',
    dates: DayJS[]
  ): DayJS | null {
    if (dates.length === 0) {
      return null
    }

    const validDates = dates.filter((d) => d.isValid())

    if (validDates.length === 0) {
      return null
    }

    let result = validDates[0]
    for (let i = 1; i < validDates.length; i += 1) {
      if (validDates[i][method](result)) {
        result = validDates[i]
      }
    }
    return result
  }
}
// minMax plugin --- end ---

// Factory function
export function dayjs(date?: DateInput, config?: Omit<Config, 'date'>): DayJS {
  if (date instanceof DayJS) {
    return date.clone()
  }
  return new DayJS({ date, ...config })
}

dayjs.prototype = DayJS.prototype

dayjs.parseLocale = (configLocale: Config['locale']) =>
  DayJS.parseLocale(configLocale).name

dayjs.isDayjs = (d: any): d is DayJS =>
  d && typeof d === 'object' && d[IS_DAYJS] === true

dayjs.unix = (timestamp: number) => dayjs(timestamp * 1e3)

// --------------------------------------------------
// plugins

// utc plugin
dayjs.utc = function (
  date?: DateInput,
  config?: Omit<Config, 'date' | 'utc'>
): DayJS {
  return dayjs(date, { utc: true, ...config })
}

// minMax plugin
dayjs.max = DayJS.max.bind(DayJS)
dayjs.min = DayJS.min.bind(DayJS)

export default dayjs
