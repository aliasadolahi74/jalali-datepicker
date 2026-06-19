/** Jalali month names (index 0 = Farvardin … 11 = Esfand). */
export const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
] as const;

/**
 * Persian weekdays in calendar order. The Persian week starts on Saturday, so
 * index 0 = Saturday … 6 = Friday — this matches the grid's left-to-right column
 * order before RTL mirroring.
 */
export const PERSIAN_WEEKDAYS_LONG = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
] as const;

/** Single-letter weekday labels for the calendar header row (Saturday → Friday). */
export const PERSIAN_WEEKDAYS_SHORT = [
  'ش',
  'ی',
  'د',
  'س',
  'چ',
  'پ',
  'ج',
] as const;

export const DAYS_IN_WEEK = 7;
export const WEEKS_IN_GRID = 6;
export const CELLS_IN_GRID = DAYS_IN_WEEK * WEEKS_IN_GRID;

/** Friday — the default Iranian weekly day off — as a Persian weekday index. */
export const FRIDAY_INDEX = 6;

/** Convert a JS `Date.getDay()` value (0 = Sunday … 6 = Saturday) to a Persian weekday index (0 = Saturday … 6 = Friday). */
export const jsDayToPersian = (jsDay: number): number => (jsDay + 1) % 7;
