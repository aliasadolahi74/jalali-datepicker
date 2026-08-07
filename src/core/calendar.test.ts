import { describe, expect, it } from 'vitest';

import {
  addDays,
  buildMonthGrid,
  compareJalali,
  dayKey,
  daysInMonth,
  diffDays,
  eachDayOfInterval,
  isLeapYear,
  todayJalali,
} from './calendar';
import type { JalaliDate } from './types';
import { toGregorian } from '../format/convert';

const d = (year: number, month: number, day: number): JalaliDate => ({
  year,
  month,
  day,
});

/** The single cell the grid considers today, or null when none is marked. */
const todayCell = (weeks: ReturnType<typeof buildMonthGrid>) => {
  const marked = weeks.flat().filter((cell) => cell.isToday);
  expect(marked.length).toBeLessThanOrEqual(1);
  return marked[0]?.key ?? null;
};

describe('injectable today', () => {
  // This suite is the reason `npm test` runs under several TZ values: every
  // assertion below must hold identically in each, which is exactly the bug —
  // the marked day used to follow whatever zone the process happened to be in.
  it('marks the injected day regardless of the process timezone', () => {
    const weeks = buildMonthGrid(1405, 5, { today: d(1405, 5, 17) });
    expect(todayCell(weeks)).toBe('1405-5-17');
  });

  it('marks the injected day even when it is an outside cell', () => {
    // 1405-6-1 is a trailing cell of the 1405-5 grid.
    const weeks = buildMonthGrid(1405, 5, { today: d(1405, 6, 1) });
    const cell = weeks.flat().find((c) => c.isToday);
    expect(cell?.key).toBe('1405-6-1');
    expect(cell?.isOutside).toBe(true);
  });

  it('marks nothing for a day outside the rendered month', () => {
    const weeks = buildMonthGrid(1405, 5, { today: d(1390, 1, 1) });
    expect(todayCell(weeks)).toBeNull();
  });

  it('marks nothing when today is null', () => {
    const weeks = buildMonthGrid(1405, 5, { today: null });
    expect(todayCell(weeks)).toBeNull();
  });

  it('falls back to the ambient date when the option is omitted', () => {
    const ambient = todayJalali();
    const weeks = buildMonthGrid(ambient.year, ambient.month);
    expect(todayCell(weeks)).toBe(dayKey(ambient));
  });

  it('treats an explicit undefined as "resolve it yourself"', () => {
    const ambient = todayJalali();
    const weeks = buildMonthGrid(ambient.year, ambient.month, {
      today: undefined,
    });
    expect(todayCell(weeks)).toBe(dayKey(ambient));
  });

  it('composes with the weeks option', () => {
    const weeks = buildMonthGrid(1405, 6, {
      weeks: 'auto',
      today: d(1405, 6, 10),
    });
    expect(weeks).toHaveLength(5);
    expect(todayCell(weeks)).toBe('1405-6-10');
  });
});

describe('todayJalali', () => {
  // The strong assertion here: these hold whatever TZ the process runs under,
  // because the zone is named rather than ambient.
  it('resolves a named zone to that zone’s calendar date', () => {
    expect(toGregorian(todayJalali('UTC'))).toBe(
      new Date().toISOString().slice(0, 10),
    );
  });

  it('tracks Tehran’s own date, which may lead UTC', () => {
    // Tehran is UTC+03:30, so it is the same day or one day ahead — never behind.
    const lead = diffDays(todayJalali('UTC'), todayJalali('Asia/Tehran'));
    expect([0, 1]).toContain(lead);
  });

  it('with no argument reads the ambient zone', () => {
    const ambientIso = [
      new Date().getFullYear(),
      String(new Date().getMonth() + 1).padStart(2, '0'),
      String(new Date().getDate()).padStart(2, '0'),
    ].join('-');
    expect(toGregorian(todayJalali())).toBe(ambientIso);
  });
});

describe('buildMonthGrid shape', () => {
  it('returns six weeks by default', () => {
    expect(buildMonthGrid(1405, 6)).toHaveLength(6);
  });

  it('trims trailing all-outside weeks with weeks: auto', () => {
    expect(buildMonthGrid(1405, 6, { weeks: 'auto' })).toHaveLength(5);
  });

  it('is Saturday-first with weekday === index mod 7', () => {
    const cells = buildMonthGrid(1404, 1).flat();
    cells.forEach((cell, index) => expect(cell.weekday).toBe(index % 7));
  });

  it('keys every cell with dayKey', () => {
    for (const cell of buildMonthGrid(1404, 1).flat()) {
      expect(cell.key).toBe(dayKey(cell.date));
    }
  });
});

describe('leap years and month lengths', () => {
  it('1403 is a leap year and 1404 is not', () => {
    expect(isLeapYear(1403)).toBe(true);
    expect(isLeapYear(1404)).toBe(false);
  });

  it('Esfand is 30 days only in a leap year', () => {
    expect(daysInMonth(1403, 12)).toBe(30);
    expect(daysInMonth(1404, 12)).toBe(29);
  });

  it('the first six months are 31 days and the next five are 30', () => {
    for (let month = 1; month <= 6; month++) {
      expect(daysInMonth(1404, month)).toBe(31);
    }
    for (let month = 7; month <= 11; month++) {
      expect(daysInMonth(1404, month)).toBe(30);
    }
  });
});

describe('day arithmetic', () => {
  it('crosses a month boundary', () => {
    expect(addDays(d(1404, 1, 31), 1)).toEqual(d(1404, 2, 1));
  });

  it('crosses a year boundary', () => {
    expect(addDays(d(1404, 12, 29), 1)).toEqual(d(1405, 1, 1));
  });

  it('lands on Esfand 30 in a leap year', () => {
    expect(addDays(d(1403, 12, 29), 1)).toEqual(d(1403, 12, 30));
    expect(addDays(d(1404, 1, 1), -1)).toEqual(d(1403, 12, 30));
  });

  it('adds zero', () => {
    expect(addDays(d(1404, 5, 5), 0)).toEqual(d(1404, 5, 5));
  });

  it('measures whole days in both directions', () => {
    expect(diffDays(d(1404, 1, 1), d(1404, 1, 10))).toBe(9);
    expect(diffDays(d(1404, 1, 10), d(1404, 1, 1))).toBe(-9);
    expect(diffDays(d(1404, 1, 1), d(1404, 1, 1))).toBe(0);
  });

  it('measures a leap year as 366 days and a common year as 365', () => {
    expect(diffDays(d(1403, 1, 1), d(1404, 1, 1))).toBe(366);
    expect(diffDays(d(1404, 1, 1), d(1405, 1, 1))).toBe(365);
  });

  it('expands an interval inclusively', () => {
    const span = eachDayOfInterval(d(1405, 6, 5), d(1405, 6, 7));
    expect(span.map(dayKey)).toEqual(['1405-6-5', '1405-6-6', '1405-6-7']);
  });

  it('returns [] when end precedes start', () => {
    expect(eachDayOfInterval(d(1404, 1, 5), d(1404, 1, 1))).toEqual([]);
  });

  it('returns one day when start equals end', () => {
    expect(eachDayOfInterval(d(1404, 1, 5), d(1404, 1, 5))).toHaveLength(1);
  });

  it('crosses a month boundary while expanding', () => {
    expect(
      eachDayOfInterval(d(1404, 1, 30), d(1404, 2, 2)).map(dayKey),
    ).toEqual(['1404-1-30', '1404-1-31', '1404-2-1', '1404-2-2']);
  });
});

describe('ordering', () => {
  it('compares by year, then month, then day', () => {
    expect(compareJalali(d(1404, 1, 1), d(1405, 1, 1))).toBe(-1);
    expect(compareJalali(d(1404, 2, 1), d(1404, 1, 1))).toBe(1);
    expect(compareJalali(d(1404, 1, 1), d(1404, 1, 1))).toBe(0);
  });
});
