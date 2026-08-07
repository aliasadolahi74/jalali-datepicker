import { describe, expect, it } from 'vitest';

import { isValidJalali, parseJalali } from './parse';
import { toJalali } from './convert';

describe('parseJalali', () => {
  it('parses the Persian long form', () => {
    expect(parseJalali('۵ شهریور ۱۴۰۵')).toEqual({
      year: 1405,
      month: 6,
      day: 5,
    });
  });

  it('parses slash and dash forms in Latin digits', () => {
    expect(parseJalali('1404/01/13')).toEqual({
      year: 1404,
      month: 1,
      day: 13,
    });
    expect(parseJalali('1404-01-13')).toEqual({
      year: 1404,
      month: 1,
      day: 13,
    });
  });

  it('accepts Persian and Arabic-Indic digits', () => {
    expect(parseJalali('۱۴۰۴/۰۱/۱۳')).toEqual({
      year: 1404,
      month: 1,
      day: 13,
    });
    expect(parseJalali('١٤٠٤/٠١/١٣')).toEqual({
      year: 1404,
      month: 1,
      day: 13,
    });
  });

  it('tolerates repeated spaces and ZWNJ', () => {
    expect(parseJalali('۵    شهریور   ۱۴۰۵')).toEqual({
      year: 1405,
      month: 6,
      day: 5,
    });
    expect(parseJalali('۱ اردی‌بهشت ۱۴۰۴')).toEqual({
      year: 1404,
      month: 2,
      day: 1,
    });
  });

  it('returns null rather than throwing on junk', () => {
    expect(parseJalali('hello')).toBeNull();
    expect(parseJalali('   ')).toBeNull();
    expect(parseJalali('')).toBeNull();
  });

  it('rejects a date that does not exist', () => {
    // Esfand 1405 has 29 days.
    expect(parseJalali('۱۴۰۵-۱۲-۳۱')).toBeNull();
  });

  it('honours an explicit pattern and rejects non-matching input', () => {
    expect(parseJalali('13/01/1404', 'DD/MM/YYYY')).toEqual({
      year: 1404,
      month: 1,
      day: 13,
    });
    expect(parseJalali('1404/01/13', 'D MMMM YYYY')).toBeNull();
  });

  it('round-trips the output of toJalali, including Esfand 30 in a leap year', () => {
    const date = { year: 1403, month: 12, day: 30 };
    expect(parseJalali(toJalali(date, 'D MMMM YYYY'))).toEqual(date);
  });
});

describe('isValidJalali', () => {
  it('accepts Esfand 30 only in a leap year', () => {
    expect(isValidJalali({ year: 1403, month: 12, day: 30 })).toBe(true);
    expect(isValidJalali({ year: 1404, month: 12, day: 30 })).toBe(false);
  });

  it('rejects out-of-range months and days', () => {
    expect(isValidJalali({ year: 1404, month: 13, day: 1 })).toBe(false);
    expect(isValidJalali({ year: 1404, month: 0, day: 1 })).toBe(false);
    expect(isValidJalali({ year: 1404, month: 1, day: 0 })).toBe(false);
    expect(isValidJalali({ year: 1404, month: 7, day: 31 })).toBe(false);
  });

  it('accepts day 31 in the first six months', () => {
    expect(isValidJalali({ year: 1404, month: 6, day: 31 })).toBe(true);
  });

  it('rejects non-integers', () => {
    expect(isValidJalali({ year: 1404, month: 1, day: 1.5 })).toBe(false);
  });
});
