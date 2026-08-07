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
// Extension is required: dayjs ships no `exports` map, so Node's ESM resolver
// takes the plain-path route and does no extension guessing. Bundlers tolerate
// the extensionless form; `node --experimental-vm-modules`-free plain Node does
// not, and throws ERR_MODULE_NOT_FOUND.
import 'dayjs/locale/fa.js';
import type { JalaliDate } from './types';

// dayjs's own idempotence guard lives on the *plugin function* (`plugin.$i`),
// which only works while every caller shares one plugin instance. Since the
// plugin is bundled into this package, our ESM and CJS builds each carry their
// own copy — and both resolve to the same dayjs module object in Node. Loading
// both (the dual-package hazard, or two versions of this package in one tree)
// would then extend the same dayjs twice and double-wrap its prototype, which
// silently corrupts every conversion. Guard on the dayjs instance instead, via
// a registry-wide symbol so separate copies of this module agree.
const INSTALLED = Symbol.for('@aliasadollahi/jalali-datepicker#jalaliday');
type Guarded = typeof dayjs & { [INSTALLED]?: boolean };

if (!(dayjs as Guarded)[INSTALLED]) {
  dayjs.extend(jalaliday);
  (dayjs as Guarded)[INSTALLED] = true;
}

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
