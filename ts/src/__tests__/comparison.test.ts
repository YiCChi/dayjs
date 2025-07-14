import MockDate from 'mockdate'
import dayjs from '../index'
import { describe, beforeEach, afterEach, test, expect, it } from 'vitest';

beforeEach(() => {
  MockDate.set(new Date())
})

afterEach(() => {
  MockDate.reset()
})

describe('isSame without units', () => {
  const m = dayjs(new Date(2011, 3, 2, 3, 4, 5, 10))
  const mCopy = dayjs(m)

  describe('year comparisons', () => {
    test('should return false when year is later', () => {
      expect(m.isSame(dayjs(new Date(2012, 3, 2, 3, 5, 5, 10)))).toBe(false)
    })

    test('should return false when year is earlier', () => {
      expect(m.isSame(dayjs(new Date(2010, 3, 2, 3, 3, 5, 10)))).toBe(false)
    })
  })

  describe('month comparisons', () => {
    test('should return false when month is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 4, 2, 3, 4, 5, 10)))).toBe(false)
    })

    test('should return false when month is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 2, 3, 4, 5, 10)))).toBe(false)
    })
  })

  describe('day comparisons', () => {
    test('should return false when day is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 3, 3, 4, 5, 10)))).toBe(false)
    })

    test('should return false when day is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 1, 3, 4, 5, 10)))).toBe(false)
    })
  })

  describe('hour comparisons', () => {
    test('should return false when hour is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 4, 4, 5, 10)))).toBe(false)
    })

    test('should return false when hour is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 2, 4, 5, 10)))).toBe(false)
    })
  })

  describe('minute comparisons', () => {
    test('should return false when minute is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 5, 5, 10)))).toBe(false)
    })

    test('should return false when minute is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 3, 5, 10)))).toBe(false)
    })
  })

  describe('second comparisons', () => {
    test('should return false when second is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 6, 10)))).toBe(false)
    })

    test('should return false when second is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 4, 11)))).toBe(false)
    })
  })

  describe('millisecond comparisons', () => {
    test('should return true when millisecond matches', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 5, 10)))).toBe(true)
    })

    test('should return false when millisecond is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 5, 11)))).toBe(false)
    })

    test('should return false when millisecond is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 5, 9)))).toBe(false)
    })
  })

  describe('self comparisons', () => {
    test('should return true when moments are the same as themselves', () => {
      expect(m.isSame(m)).toBe(true)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isSame with year unit', () => {
  const m = dayjs(new Date(2011, 1, 2, 3, 4, 5, 6))
  const mCopy = dayjs(m)

  describe('year matching', () => {
    test('should return true when year matches', () => {
      expect(m.isSame(dayjs(new Date(2011, 5, 6, 7, 8, 9, 10)), 'year')).toBe(true)
    })

    test('should return false when year mismatches', () => {
      expect(m.isSame(dayjs(new Date(2012, 5, 6, 7, 8, 9, 10)), 'year')).toBe(false)
    })
  })

  describe('year boundaries', () => {
    test('should return true at exact start of year', () => {
      expect(m.isSame(dayjs(new Date(2011, 0, 1, 0, 0, 0, 0)), 'year')).toBe(true)
    })

    test('should return true at exact end of year', () => {
      expect(m.isSame(dayjs(new Date(2011, 11, 31, 23, 59, 59, 999)), 'year')).toBe(true)
    })

    test('should return false at start of next year', () => {
      expect(m.isSame(dayjs(new Date(2012, 0, 1, 0, 0, 0, 0)), 'year')).toBe(false)
    })

    test('should return false at end of previous year', () => {
      expect(m.isSame(dayjs(new Date(2010, 11, 31, 23, 59, 59, 999)), 'year')).toBe(false)
    })
  })

  describe('self comparison', () => {
    test('should return true when same moments are in the same year', () => {
      expect(m.isSame(m, 'year')).toBe(true)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isSame with month unit', () => {
  const m = dayjs(new Date(2011, 2, 3, 4, 5, 6, 7))
  const mCopy = dayjs(m)

  describe('month matching', () => {
    test('should return true when month matches', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 6, 7, 8, 9, 10)), 'month')).toBe(true)
    })

    test('should return false when year mismatches', () => {
      expect(m.isSame(dayjs(new Date(2012, 2, 6, 7, 8, 9, 10)), 'month')).toBe(false)
    })

    test('should return false when month mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 5, 6, 7, 8, 9, 10)), 'month')).toBe(false)
    })
  })

  describe('month boundaries', () => {
    test('should return true at exact start of month', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 1, 0, 0, 0, 0)), 'month')).toBe(true)
    })

    test('should return true at exact end of month', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 31, 23, 59, 59, 999)), 'month')).toBe(true)
    })

    test('should return false at start of next month', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 1, 0, 0, 0, 0)), 'month')).toBe(false)
    })

    test('should return false at end of previous month', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 27, 23, 59, 59, 999)), 'month')).toBe(false)
    })
  })

  describe('self comparison', () => {
    test('should return true when same moments are in the same month', () => {
      expect(m.isSame(m, 'month')).toBe(true)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isSame with day unit', () => {
  const m = dayjs(new Date(2011, 1, 2, 3, 4, 5, 6))
  const mCopy = dayjs(m)

  describe('day matching', () => {
    test('should return true when day matches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 7, 8, 9, 10)), 'day')).toBe(true)
    })

    test('should return false when year mismatches', () => {
      expect(m.isSame(dayjs(new Date(2012, 1, 2, 7, 8, 9, 10)), 'day')).toBe(false)
    })

    test('should return false when month mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 2, 7, 8, 9, 10)), 'day')).toBe(false)
    })

    test('should return false when day mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 3, 7, 8, 9, 10)), 'day')).toBe(false)
    })
  })

  describe('day boundaries', () => {
    test('should return true at exact start of day', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 0, 0, 0, 0)), 'day')).toBe(true)
    })

    test('should return true at exact end of day', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 23, 59, 59, 999)), 'day')).toBe(true)
    })

    test('should return false at start of next day', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 3, 0, 0, 0, 0)), 'day')).toBe(false)
    })

    test('should return false at end of previous day', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 1, 23, 59, 59, 999)), 'day')).toBe(false)
    })
  })

  describe('self comparison', () => {
    test('should return true when same moments are in the same day', () => {
      expect(m.isSame(m, 'day')).toBe(true)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isSame with hour unit', () => {
  const m = dayjs(new Date(2011, 1, 2, 3, 4, 5, 6))
  const mCopy = dayjs(m)

  describe('hour matching', () => {
    test('should return true when hour matches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 8, 9, 10)), 'hour')).toBe(true)
    })

    test('should return false when year mismatches', () => {
      expect(m.isSame(dayjs(new Date(2012, 1, 2, 3, 8, 9, 10)), 'hour')).toBe(false)
    })

    test('should return false when month mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 2, 3, 8, 9, 10)), 'hour')).toBe(false)
    })

    test('should return false when day mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 3, 3, 8, 9, 10)), 'hour')).toBe(false)
    })

    test('should return false when hour mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 4, 8, 9, 10)), 'hour')).toBe(false)
    })
  })

  describe('hour boundaries', () => {
    test('should return true at exact start of hour', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 0, 0, 0)), 'hour')).toBe(true)
    })

    test('should return true at exact end of hour', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 59, 59, 999)), 'hour')).toBe(true)
    })

    test('should return false at start of next hour', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 4, 0, 0, 0)), 'hour')).toBe(false)
    })

    test('should return false at end of previous hour', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 2, 59, 59, 999)), 'hour')).toBe(false)
    })
  })

  describe('self comparison', () => {
    test('should return true when same moments are in the same hour', () => {
      expect(m.isSame(m, 'hour')).toBe(true)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isSame with minute unit', () => {
  const m = dayjs(new Date(2011, 1, 2, 3, 4, 5, 6))
  const mCopy = dayjs(m)

  describe('minute matching', () => {
    test('should return true when minute matches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 9, 10)), 'minute')).toBe(true)
    })

    test('should return false when year mismatches', () => {
      expect(m.isSame(dayjs(new Date(2012, 1, 2, 3, 4, 9, 10)), 'minute')).toBe(false)
    })

    test('should return false when month mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 2, 3, 4, 9, 10)), 'minute')).toBe(false)
    })

    test('should return false when day mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 3, 3, 4, 9, 10)), 'minute')).toBe(false)
    })

    test('should return false when hour mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 4, 4, 9, 10)), 'minute')).toBe(false)
    })

    test('should return false when minute mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 5, 9, 10)), 'minute')).toBe(false)
    })
  })

  describe('minute boundaries', () => {
    test('should return true at exact start of minute', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 0, 0)), 'minute')).toBe(true)
    })

    test('should return true at exact end of minute', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 59, 999)), 'minute')).toBe(true)
    })

    test('should return false at start of next minute', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 5, 0, 0)), 'minute')).toBe(false)
    })

    test('should return false at end of previous minute', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 3, 59, 999)), 'minute')).toBe(false)
    })
  })

  describe('self comparison', () => {
    test('should return true when same moments are in the same minute', () => {
      expect(m.isSame(m, 'minute')).toBe(true)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isSame with second unit', () => {
  const m = dayjs(new Date(2011, 1, 2, 3, 4, 5, 6))
  const mCopy = dayjs(m)

  describe('second matching', () => {
    test('should return true when second matches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 5, 10)), 'second')).toBe(true)
    })

    test('should return false when year mismatches', () => {
      expect(m.isSame(dayjs(new Date(2012, 1, 2, 3, 4, 5, 10)), 'second')).toBe(false)
    })

    test('should return false when month mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 2, 3, 4, 5, 10)), 'second')).toBe(false)
    })

    test('should return false when day mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 3, 3, 4, 5, 10)), 'second')).toBe(false)
    })

    test('should return false when hour mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 4, 4, 5, 10)), 'second')).toBe(false)
    })

    test('should return false when minute mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 5, 5, 10)), 'second')).toBe(false)
    })

    test('should return false when second mismatches', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 6, 10)), 'second')).toBe(false)
    })
  })

  describe('second boundaries', () => {
    test('should return true at exact start of second', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 5, 0)), 'second')).toBe(true)
    })

    test('should return true at exact end of second', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 5, 999)), 'second')).toBe(true)
    })

    test('should return false at start of next second', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 6, 0)), 'second')).toBe(false)
    })

    test('should return false at end of previous second', () => {
      expect(m.isSame(dayjs(new Date(2011, 1, 2, 3, 4, 4, 999)), 'second')).toBe(false)
    })
  })

  describe('self comparison', () => {
    test('should return true when same moments are in the same second', () => {
      expect(m.isSame(m, 'second')).toBe(true)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isSame with millisecond unit', () => {
  const m = dayjs(new Date(2011, 3, 2, 3, 4, 5, 10))
  const mCopy = dayjs(m)

  describe('millisecond matching', () => {
    test('should return true when millisecond matches', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 5, 10)), 'millisecond')).toBe(true)
    })

    test('should return false when year is later', () => {
      expect(m.isSame(dayjs(new Date(2012, 3, 2, 3, 4, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when year is earlier', () => {
      expect(m.isSame(dayjs(new Date(2010, 3, 2, 3, 4, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when month is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 4, 2, 3, 4, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when month is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 2, 2, 3, 4, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when day is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 3, 3, 4, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when day is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 1, 1, 4, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when hour is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 4, 4, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when hour is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 1, 4, 1, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when minute is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 5, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when minute is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 3, 5, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when second is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 6, 10)), 'millisecond')).toBe(false)
    })

    test('should return false when second is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 4, 5)), 'millisecond')).toBe(false)
    })

    test('should return false when millisecond is later', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 6, 11)), 'millisecond')).toBe(false)
    })

    test('should return false when millisecond is earlier', () => {
      expect(m.isSame(dayjs(new Date(2011, 3, 2, 3, 4, 4, 9)), 'millisecond')).toBe(false)
    })
  })

  describe('self comparison', () => {
    test('should return true when same moments are in the same millisecond', () => {
      expect(m.isSame(m, 'millisecond')).toBe(true)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isSame with invalid moments', () => {
  test('should return false when first moment is invalid', () => {
    expect(dayjs(null).isSame(dayjs('2018-01-01'))).toBe(false)
  })

  test('should return false when second moment is invalid', () => {
    expect(dayjs('2018-01-01').isSame(dayjs(null))).toBe(false)
  })
})

describe('isAfter with year unit', () => {
  const m = dayjs(new Date(2011, 1, 2, 3, 4, 5, 6))
  const mCopy = dayjs(m)

  describe('year comparisons', () => {
    test('should return false when year matches', () => {
      expect(m.isAfter(dayjs(new Date(2011, 5, 6, 7, 8, 9, 10)), 'year')).toBe(false)
    })

    test('should return false when year is later', () => {
      expect(m.isAfter(dayjs(new Date(2013, 5, 6, 7, 8, 9, 10)), 'year')).toBe(false)
    })

    test('should return true when year is earlier', () => {
      expect(m.isAfter(dayjs(new Date(2010, 5, 6, 7, 8, 9, 10)), 'year')).toBe(true)
    })
  })

  describe('year boundaries', () => {
    test('should return false at exact start of year', () => {
      expect(m.isAfter(dayjs(new Date(2011, 0, 1, 0, 0, 0, 0)), 'year')).toBe(false)
    })

    test('should return false at exact end of year', () => {
      expect(m.isAfter(dayjs(new Date(2011, 11, 31, 23, 59, 59, 999)), 'year')).toBe(false)
    })

    test('should return false at start of next year', () => {
      expect(m.isAfter(dayjs(new Date(2012, 0, 1, 0, 0, 0, 0)), 'year')).toBe(false)
    })

    test('should return true at end of previous year', () => {
      expect(m.isAfter(dayjs(new Date(2010, 11, 31, 23, 59, 59, 999)), 'year')).toBe(true)
    })

    test('should return true at end of year far before', () => {
      expect(m.isAfter(dayjs(new Date(1980, 11, 31, 23, 59, 59, 999)), 'year')).toBe(true)
    })
  })

  describe('self comparison', () => {
    test('should return false when same moments are in the same year', () => {
      expect(m.isAfter(m, 'year')).toBe(false)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isAfter with month unit', () => {
  const m = dayjs(new Date(2011, 2, 3, 4, 5, 6, 7))
  const mCopy = dayjs(m)

  describe('month comparisons', () => {
    test('should return false when month matches', () => {
      expect(m.isAfter(dayjs(new Date(2011, 2, 6, 7, 8, 9, 10)), 'month')).toBe(false)
    })

    test('should return false when year is later', () => {
      expect(m.isAfter(dayjs(new Date(2012, 2, 6, 7, 8, 9, 10)), 'month')).toBe(false)
    })

    test('should return true when year is earlier', () => {
      expect(m.isAfter(dayjs(new Date(2010, 2, 6, 7, 8, 9, 10)), 'month')).toBe(true)
    })

    test('should return false when month is later', () => {
      expect(m.isAfter(dayjs(new Date(2011, 5, 6, 7, 8, 9, 10)), 'month')).toBe(false)
    })

    test('should return true when month is earlier', () => {
      expect(m.isAfter(dayjs(new Date(2011, 1, 6, 7, 8, 9, 10)), 'month')).toBe(true)
    })
  })

  describe('month boundaries', () => {
    test('should return false at exact start of month', () => {
      expect(m.isAfter(dayjs(new Date(2011, 2, 1, 0, 0, 0, 0)), 'month')).toBe(false)
    })

    test('should return false at exact end of month', () => {
      expect(m.isAfter(dayjs(new Date(2011, 2, 31, 23, 59, 59, 999)), 'month')).toBe(false)
    })

    test('should return false at start of next month', () => {
      expect(m.isAfter(dayjs(new Date(2011, 3, 1, 0, 0, 0, 0)), 'month')).toBe(false)
    })

    test('should return true at end of previous month', () => {
      expect(m.isAfter(dayjs(new Date(2011, 1, 27, 23, 59, 59, 999)), 'month')).toBe(true)
    })

    test('should return true at later month but earlier year', () => {
      expect(m.isAfter(dayjs(new Date(2010, 12, 31, 23, 59, 59, 999)), 'month')).toBe(true)
    })
  })

  describe('self comparison', () => {
    test('should return false when same moments are not after the same month', () => {
      expect(m.isAfter(m, 'month')).toBe(false)
    })

    test('should not change the original moment', () => {
      expect(+m).toEqual(+mCopy)
    })
  })
})

describe('isAfter with invalid moments', () => {
  const m = dayjs()
  const invalid = dayjs(null)

  describe('invalid moment comparisons', () => {
    test('should return false when valid moment is not after invalid moment', () => {
      expect(m.isAfter(invalid)).toBe(false)
    })

    test('should return false when invalid moment is not after valid moment', () => {
      expect(invalid.isAfter(m)).toBe(false)
    })

    test('should return false for invalid moment year', () => {
      expect(m.isAfter(invalid, 'year')).toBe(false)
    })

    test('should return false for invalid moment month', () => {
      expect(m.isAfter(invalid, 'month')).toBe(false)
    })

    test('should return false for invalid moment day', () => {
      expect(m.isAfter(invalid, 'day')).toBe(false)
    })

    test('should return false for invalid moment hour', () => {
      expect(m.isAfter(invalid, 'hour')).toBe(false)
    })

    test('should return false for invalid moment minute', () => {
      expect(m.isAfter(invalid, 'minute')).toBe(false)
    })

    test('should return false for invalid moment second', () => {
      expect(m.isAfter(invalid, 'second')).toBe(false)
    })

    test('should return false for invalid moment millisecond', () => {
      expect(m.isAfter(invalid, 'millisecond')).toBe(false)
    })
  })
})

describe('isBefore with invalid moments', () => {
  const m = dayjs()
  const invalid = dayjs(null)

  describe('invalid moment comparisons', () => {
    test('should return false when valid moment is not before invalid moment', () => {
      expect(m.isBefore(invalid)).toBe(false)
    })

    test('should return false when invalid moment is not before valid moment', () => {
      expect(invalid.isBefore(m)).toBe(false)
    })

    test('should return false for invalid moment year', () => {
      expect(m.isBefore(invalid, 'year')).toBe(false)
    })

    test('should return false for invalid moment month', () => {
      expect(m.isBefore(invalid, 'month')).toBe(false)
    })

    test('should return false for invalid moment day', () => {
      expect(m.isBefore(invalid, 'day')).toBe(false)
    })

    test('should return false for invalid moment hour', () => {
      expect(m.isBefore(invalid, 'hour')).toBe(false)
    })

    test('should return false for invalid moment minute', () => {
      expect(m.isBefore(invalid, 'minute')).toBe(false)
    })

    test('should return false for invalid moment second', () => {
      expect(m.isBefore(invalid, 'second')).toBe(false)
    })

    test('should return false for invalid moment millisecond', () => {
      expect(m.isBefore(invalid, 'millisecond')).toBe(false)
    })
  })
})
