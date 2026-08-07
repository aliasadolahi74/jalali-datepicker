/**
 * The inverse of `toJalali`. Real payloads carry pre-rendered Jalali strings
 * («۵ شهریور ۱۴۰۵», "۱۴۰۴/۰۱/۱۳") with no ISO date alongside, so getting back to
 * a `JalaliDate` is a parsing problem — and parsing untrusted input is why
 * everything here returns `null` instead of throwing.
 */
import { daysInMonth } from '../core/calendar';
import { JALALI_MONTHS } from '../core/constants';
import type { JalaliDate } from '../core/types';
import { toLatinDigits } from './digits';

/** Patterns tried, in order, when the caller does not name one. */
const DEFAULT_PATTERNS = ['YYYY/MM/DD', 'YYYY-MM-DD', 'D MMMM YYYY'];

/** Zero-width non-joiner — sits inside Persian month names and weekday names. */
const ZWNJ = /[‌‏‎]/g;

/** Longest-first so `MMMM` wins over `MM`, and `YYYY` over `YY`. */
const TOKEN = /YYYY|YY|MMMM|MM|M|DD|D/g;

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/g;

/** Month names, ZWNJ-stripped, mapped to their 1-based index. */
const MONTH_INDEX = new Map(
  JALALI_MONTHS.map((name, index) => [name.replace(ZWNJ, ''), index + 1]),
);

const MONTH_ALTERNATION = JALALI_MONTHS.map((name) =>
  name.replace(ZWNJ, '').replace(REGEX_SPECIAL, '\\$&'),
).join('|');

/**
 * Fold a string into the shape the matcher expects: Latin digits, no
 * zero-width/bidi marks, and runs of whitespace collapsed to one space.
 */
function normalize(value: string): string {
  return toLatinDigits(value).replace(ZWNJ, '').replace(/\s+/g, ' ').trim();
}

interface CompiledPattern {
  regex: RegExp;
  /** Which capture group index holds each field (0 = not present). */
  groups: { year: number; month: number; day: number; monthName: number };
}

const compiled = new Map<string, CompiledPattern | null>();

/**
 * Turn a format pattern into an anchored regex. Literal text between tokens is
 * escaped; whitespace matches loosely so "۵  شهریور ۱۴۰۵" still parses.
 */
function compile(pattern: string): CompiledPattern | null {
  const cached = compiled.get(pattern);
  if (cached !== undefined) return cached;

  const groups = { year: 0, month: 0, day: 0, monthName: 0 };
  let group = 0;
  let source = '';
  let last = 0;

  const literal = (text: string): string =>
    text.replace(REGEX_SPECIAL, '\\$&').replace(/\s+/g, '\\s+');

  TOKEN.lastIndex = 0;
  for (let m = TOKEN.exec(pattern); m; m = TOKEN.exec(pattern)) {
    source += literal(pattern.slice(last, m.index));
    last = m.index + m[0].length;
    group += 1;
    switch (m[0]) {
      case 'YYYY':
        source += '(\\d{4})';
        groups.year = group;
        break;
      case 'YY':
        source += '(\\d{2})';
        groups.year = group;
        break;
      case 'MMMM':
        source += `(${MONTH_ALTERNATION})`;
        groups.monthName = group;
        break;
      case 'MM':
        source += '(\\d{2})';
        groups.month = group;
        break;
      case 'M':
        source += '(\\d{1,2})';
        groups.month = group;
        break;
      case 'DD':
        source += '(\\d{2})';
        groups.day = group;
        break;
      default:
        source += '(\\d{1,2})';
        groups.day = group;
    }
  }
  source += literal(pattern.slice(last));

  // A pattern that names no year, or neither month form, can never yield a date.
  const usable =
    groups.year > 0 &&
    groups.day > 0 &&
    (groups.month > 0 || groups.monthName > 0);
  const result = usable ? { regex: new RegExp(`^${source}$`), groups } : null;
  compiled.set(pattern, result);
  return result;
}

function match(input: string, pattern: string): JalaliDate | null {
  const spec = compile(pattern);
  if (!spec) return null;

  const found = spec.regex.exec(input);
  if (!found) return null;

  const { year, month, day, monthName } = spec.groups;
  const parsedYear = Number(found[year]);
  const parsedMonth = monthName
    ? MONTH_INDEX.get(found[monthName])
    : Number(found[month]);
  const parsedDay = Number(found[day]);

  if (parsedMonth === undefined) return null;
  // `YY` is ambiguous on its own; treat it as an offset into the current century.
  const fullYear = found[year].length === 2 ? 1400 + parsedYear : parsedYear;

  const date = { year: fullYear, month: parsedMonth, day: parsedDay };
  return isValidJalali(date) ? date : null;
}

/**
 * Parse a Jalali date string into a {@link JalaliDate}, or `null` if it does not
 * match — so a caller can fall back to rendering the server's string verbatim.
 *
 * Accepts Persian, Arabic-Indic, or Latin digits, and tolerates ZWNJ, bidi
 * marks, and repeated spaces. Without a `pattern`, tries `'YYYY/MM/DD'`,
 * `'YYYY-MM-DD'`, then `'D MMMM YYYY'`.
 *
 * Supported tokens: `YYYY`, `YY`, `MMMM` (Persian month name), `MM`, `M`,
 * `DD`, `D`. Anything else in the pattern is matched literally.
 *
 * ```ts
 * parseJalali('۵ شهریور ۱۴۰۵');        // { year: 1405, month: 6, day: 5 }
 * parseJalali('1404/01/13');            // { year: 1404, month: 1, day: 13 }
 * parseJalali('۱۴۰۵-۱۲-۳۱');            // null — Esfand 1405 has 29 days
 * parseJalali('13 Jan 2024', 'D MMMM YYYY'); // null
 * ```
 */
export function parseJalali(
  input: string,
  pattern?: string,
): JalaliDate | null {
  if (typeof input !== 'string') return null;
  const normalized = normalize(input);
  if (!normalized) return null;

  const patterns = pattern ? [pattern] : DEFAULT_PATTERNS;
  for (const candidate of patterns) {
    const result = match(normalized, candidate);
    if (result) return result;
  }
  return null;
}

/**
 * Whether a {@link JalaliDate} names a day that exists — month in 1…12 and day
 * within that month's real length, so Esfand 30 is valid only in a leap year.
 */
export function isValidJalali(date: JalaliDate): boolean {
  if (!date || typeof date !== 'object') return false;
  const { year, month, day } = date;
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  )
    return false;
  // Bounded to keep the underlying engine in well-defined territory.
  if (year < 1 || year > 3000) return false;
  if (month < 1 || month > 12) return false;
  return day >= 1 && day <= daysInMonth(year, month);
}
