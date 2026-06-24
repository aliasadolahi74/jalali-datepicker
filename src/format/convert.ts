/**
 * Output adapters — the "convert at the end" surface of the package.
 *
 * A selected {@link JalaliDate} can be turned into a JS `Date`, a Unix
 * timestamp, a formatted Gregorian string, or a formatted Jalali string. Format
 * strings use dayjs tokens (`YYYY`, `MM`, `dddd`, `MMMM`, …).
 */
import { dayjs, jalaliDayjs, toJalaliDate } from '../core/dayjs';
import type { JalaliDate } from '../core/types';
import { toPersianDigits } from './digits';

/** The native `Date` at local midnight of the given Jalali day. */
export function toDate(date: JalaliDate): Date {
  return jalaliDayjs(date).toDate();
}

export interface TimestampOptions {
  /** `'ms'` (default) returns epoch milliseconds; `'s'` returns whole seconds. */
  unit?: 'ms' | 's';
}

/** Epoch timestamp for local midnight of the given Jalali day. */
export function toTimestamp(
  date: JalaliDate,
  options?: TimestampOptions,
): number {
  const ms = jalaliDayjs(date).valueOf();
  return options?.unit === 's' ? Math.floor(ms / 1000) : ms;
}

/**
 * Format the day in the Gregorian calendar. Built from the timestamp through a
 * plain (default-calendar) dayjs, so it is independent of the Jalali plugin's
 * calendar switching. Defaults to ISO `YYYY-MM-DD`.
 */
export function toGregorian(date: JalaliDate, format = 'YYYY-MM-DD'): string {
  return dayjs(jalaliDayjs(date).valueOf()).format(format);
}

export interface JalaliFormatOptions {
  /** Render the output with Persian digits (default `true`). */
  persianDigits?: boolean;
}

/**
 * Format the day in the Jalali calendar with Persian month/weekday names (`fa`
 * locale). Defaults to `YYYY/MM/DD` and Persian digits.
 */
export function toJalali(
  date: JalaliDate,
  format = 'YYYY/MM/DD',
  options?: JalaliFormatOptions,
): string {
  const formatted = jalaliDayjs(date).locale('fa').format(format);
  return options?.persianDigits === false
    ? formatted
    : toPersianDigits(formatted);
}

/** Convert a native `Date` to its Jalali parts. */
export function fromDate(date: Date): JalaliDate {
  return toJalaliDate(dayjs(date));
}

/** Convert an epoch timestamp to its Jalali parts. */
export function fromTimestamp(
  value: number,
  options?: TimestampOptions,
): JalaliDate {
  const ms = options?.unit === 's' ? value * 1000 : value;
  return toJalaliDate(dayjs(ms));
}

/**
 * Convert a Gregorian `YYYY-MM-DD` string to Jalali parts. The string is parsed
 * as local time (dayjs treats date-only strings as local), so it round-trips with
 * {@link toGregorian} without a timezone shift.
 */
export function fromGregorian(iso: string): JalaliDate {
  return toJalaliDate(dayjs(iso));
}
