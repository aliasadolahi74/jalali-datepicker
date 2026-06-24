import type { JalaliDate } from '../core/types';
import type { DayMeta, HolidayConfig } from './types';

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
  for (const rule of config.rules) {
    const matches =
      rule.type === 'recurring'
        ? rule.month === date.month && rule.day === date.day
        : rule.year === date.year &&
          rule.month === date.month &&
          rule.day === date.day;
    if (matches) labels.push(rule.label);
  }

  const isHoliday = labels.length > 0;
  return { isWeekend, isHoliday, isOff: isWeekend || isHoliday, labels };
}
