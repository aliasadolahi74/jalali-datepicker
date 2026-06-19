/**
 * The single configured dayjs instance for the whole feature.
 *
 * This is the *only* module that imports dayjs or the Jalali plugin directly —
 * every other file talks to dayjs through the helpers here. Swapping the
 * underlying engine (a different Jalali plugin, a vendored algorithm, …) is
 * therefore a one-file change, which keeps the package portable.
 */
import dayjs, { type Dayjs } from 'dayjs';
import jalaliday from 'jalaliday/dayjs';
import 'dayjs/locale/fa';
import type { JalaliDate } from './types';

// `extend` is idempotent in dayjs (guarded by an internal flag), so importing
// this module from multiple places only ever registers the plugin once.
dayjs.extend(jalaliday);

const pad = (value: number): string => String(value).padStart(2, '0');

/**
 * Build a Dayjs locked to the Jalali calendar at local midnight from 1-based
 * Jalali parts. Parsing a zero-padded `YYYY-MM-DD` string with `{ jalali: true }`
 * is the construction path jalaliday documents and the one verified to round-trip.
 */
export function jalaliDayjs({ year, month, day }: JalaliDate): Dayjs {
  return dayjs(`${year}-${pad(month)}-${pad(day)}`, { jalali: true })
    .calendar('jalali')
    .startOf('day');
}

/** Read 1-based Jalali parts out of any Dayjs instance. */
export function toJalaliDate(input: Dayjs): JalaliDate {
  const j = input.calendar('jalali');
  return { year: j.year(), month: j.month() + 1, day: j.date() };
}

export { dayjs };
export type { Dayjs };
