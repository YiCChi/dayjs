type Locales = 'en' | 'ja' | 'zh-cn'

interface ILocale {
  name: string
  weekdays: string[]
  months: string[]
  monthsShort?: string[]
  /**
   * The first day of the week, 0 for Sunday, 1 for Monday, etc.
   */
  weekStart?: number
  weekdaysShort?: string[]
  weekdaysMin?: string[]
  ordinal: (n: number) => string
  meridiem: (hour: number, minute: number, isLowercase: boolean) => string
  formats: {
    LT: string
    LTS: string
    L: string
    LL: string
    LLL: string
    LLLL: string
  }
  relativeTime: {
    future: string
    past: string
    s: string
    m: string
    mm: string
    h: string
    hh: string
    d: string
    dd: string
    M: string
    MM: string
    y: string
    yy: string
  }
}

const en: ILocale = {
  name: 'en',
  weekdays: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  ordinal: (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd']
    const v = n % 100
    return `[${n}${s[(v - 20) % 10] || s[v] || s[0]}]`
  },
  formats: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'YYYY-MM-DD',
    LL: 'MMMM D, YYYY',
    LLL: 'MMMM D, YYYY h:mm A',
    LLLL: 'dddd, MMMM D, YYYY h:mm A'
  },
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  },
  meridiem: (hour: number, _minute: number, isLowercase: boolean) => {
    const m = hour < 12 ? 'AM' : 'PM'
    return isLowercase ? m.toLowerCase() : m
  }
}

const ja: ILocale = {
  name: 'ja',
  weekdays: [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日'
  ],
  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
  weekdaysMin: ['日', '月', '火', '水', '木', '金', '土'],
  months: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月'
  ],
  monthsShort: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月'
  ],
  ordinal: (n: number): string => `${n}日`,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY/MM/DD',
    LL: 'YYYY年M月D日',
    LLL: 'YYYY年M月D日 HH:mm',
    LLLL: 'YYYY年M月D日 dddd HH:mm'
  },
  relativeTime: {
    future: '%s後',
    past: '%s前',
    s: '数秒',
    m: '1分',
    mm: '%d分',
    h: '1時間',
    hh: '%d時間',
    d: '1日',
    dd: '%d日',
    M: '1ヶ月',
    MM: '%dヶ月',
    y: '1年',
    yy: '%d年'
  },
  meridiem: (hour) => (hour < 12 ? '午前' : '午後')
}

const zhCn: ILocale = {
  name: 'zh-cn',
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  months:
    '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
      '_'
    ),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  ordinal: (n: number): string => `${n}日`,
  weekStart: 1,
  formats: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY/MM/DD',
    LL: 'YYYY年M月D日',
    LLL: 'YYYY年M月D日Ah点mm分',
    LLLL: 'YYYY年M月D日ddddAh点mm分'
  },
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1 天',
    dd: '%d 天',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年'
  },
  meridiem: (hour, minute) => {
    const hm = hour * 100 + minute
    if (hm < 600) {
      return '凌晨'
    } else if (hm < 900) {
      return '早上'
    } else if (hm < 1100) {
      return '上午'
    } else if (hm < 1300) {
      return '中午'
    } else if (hm < 1800) {
      return '下午'
    }
    return '晚上'
  }
}

const locales = {
  en,
  ja,
  'zh-cn': zhCn
} as const

export { en, ja, locales, zhCn }
export type { ILocale, Locales }
