/**
 * Pure Jalali calendar math. Nothing here knows about React, holidays, styling,
 * or selection — it only turns Jalali coordinates into month grids and answers
 * questions about lengths, leap years, weekdays, and ordering. Leap years and
 * month lengths are delegated to the dayjs Jalali engine, which is correct
 * across the full range (verified: Esfand is 30 days only in leap years).
 */
import { dayjs, jalaliDayjs, toJalaliDate } from './dayjs';
import type { BaseDayCell, JalaliDate } from './types';
import { CELLS_IN_GRID, DAYS_IN_WEEK, jsDayToPersian } from './constants';

/** Today in the Jalali calendar (local time). */
export function todayJalali(): JalaliDate {
  return toJalaliDate(dayjs());
}

/** Number of days in the given Jalali month (handles Esfand's 29/30 split). */
export function daysInMonth(year: number, month: number): number {
  return jalaliDayjs({ year, month, day: 1 }).daysInMonth();
}

/** Whether the given Jalali year is a leap year (Esfand has 30 days). */
export function isLeapYear(year: number): boolean {
  return daysInMonth(year, 12) === 30;
}

/** Persian weekday index (0 = Saturday … 6 = Friday) for a date. */
export function persianWeekday(date: JalaliDate): number {
  return jsDayToPersian(jalaliDayjs(date).day());
}

const dateKey = ({ year, month, day }: JalaliDate): string =>
  `${year}-${month}-${day}`;

/** Add `delta` months to a `{ year, month }` pair, normalizing across year boundaries. */
export function addMonths(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const zeroBased = month - 1 + delta;
  return {
    year: year + Math.floor(zeroBased / 12),
    month: (((zeroBased % 12) + 12) % 12) + 1,
  };
}

/** Returns -1 when a < b, 0 when equal, 1 when a > b. */
export function compareJalali(a: JalaliDate, b: JalaliDate): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

export function isSameDay(
  a: JalaliDate | null | undefined,
  b: JalaliDate | null | undefined,
): boolean {
  return (
    !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day
  );
}

/** Clamp a date into the inclusive `[min, max]` range (either bound optional). */
export function clampToRange(
  date: JalaliDate,
  min?: JalaliDate | null,
  max?: JalaliDate | null,
): JalaliDate {
  if (min && compareJalali(date, min) < 0) return min;
  if (max && compareJalali(date, max) > 0) return max;
  return date;
}

/**
 * Build a fixed 6×7 month grid (always 42 cells) for the given Jalali month.
 * Leading cells come from the previous month and trailing cells from the next
 * month, both flagged `isOutside`. Because the grid is Saturday-first and filled
 * day-by-day, a cell's weekday is simply its linear index mod 7 — no per-cell
 * date conversion needed.
 */
export function buildMonthGrid(year: number, month: number): BaseDayCell[][] {
  const today = todayJalali();
  const firstWeekday = persianWeekday({ year, month, day: 1 });
  const totalDays = daysInMonth(year, month);

  const prev = addMonths(year, month, -1);
  const prevLength = daysInMonth(prev.year, prev.month);
  const next = addMonths(year, month, 1);

  const slots: Array<{ date: JalaliDate; isOutside: boolean }> = [];

  for (let i = firstWeekday; i > 0; i--) {
    slots.push({ date: { ...prev, day: prevLength - i + 1 }, isOutside: true });
  }
  for (let day = 1; day <= totalDays; day++) {
    slots.push({ date: { year, month, day }, isOutside: false });
  }
  for (let day = 1; slots.length < CELLS_IN_GRID; day++) {
    slots.push({ date: { ...next, day }, isOutside: true });
  }

  const weeks: BaseDayCell[][] = [];
  for (let i = 0; i < slots.length; i += DAYS_IN_WEEK) {
    const week = slots.slice(i, i + DAYS_IN_WEEK).map((slot, column) => ({
      date: slot.date,
      key: dateKey(slot.date),
      weekday: (i + column) % DAYS_IN_WEEK,
      isOutside: slot.isOutside,
      isToday: isSameDay(slot.date, today),
    }));
    weeks.push(week);
  }
  return weeks;
}
