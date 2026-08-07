import { compareJalali } from '../core/calendar';
import type { JalaliDate } from '../core/types';
import type { DayMeta, HolidayConfig, HolidayRule } from './types';

function matches(rule: HolidayRule, date: JalaliDate): boolean {
  switch (rule.type) {
    case 'recurring':
      return rule.month === date.month && rule.day === date.day;
    case 'specific':
      return (
        rule.year === date.year &&
        rule.month === date.month &&
        rule.day === date.day
      );
    case 'range':
      return (
        compareJalali(date, rule.start) >= 0 &&
        compareJalali(date, rule.end) <= 0
      );
  }
}

/**
 * Resolve weekend/holiday metadata for a single day.
 *
 * `weekday` is the Persian weekday index (0 = Saturday … 6 = Friday) and is
 * passed in by the caller, so this resolver stays a pure function of plain data
 * with no dependency on any date engine.
 */
export function resolveDayMeta(
  date: JalaliDate,
  weekday: number,
  config: HolidayConfig,
): DayMeta {
  const isWeekend = config.weekends.includes(weekday);

  const labels: string[] = [];
  const matched: HolidayRule[] = [];
  const categories: string[] = [];

  for (const rule of config.rules) {
    if (!matches(rule, date)) continue;
    matched.push(rule);
    labels.push(rule.label);
    if (rule.category && !categories.includes(rule.category)) {
      categories.push(rule.category);
    }
  }

  const isHoliday = matched.length > 0;
  return {
    isWeekend,
    isHoliday,
    isOff: isWeekend || isHoliday,
    labels,
    matched,
    categories,
  };
}
