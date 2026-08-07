/**
 * The injectable "days off" configuration model. Consumers supply a
 * {@link HolidayConfig} (see `iran.holidays.ts` for the default) to mark
 * weekends, public holidays, and vacations — without touching the picker.
 */
import type { JalaliDate } from '../core/types';

/** A holiday that recurs on the same Jalali month/day every year (a fixed solar holiday). */
export interface RecurringHolidayRule {
  type: 'recurring';
  /** Jalali month, 1-based. */
  month: number;
  /** Day of month, 1-based. */
  day: number;
  label: string;
  /** Free-form grouping tag, surfaced on {@link DayMeta.categories} for styling. */
  category?: string;
}

/**
 * A holiday that falls on one specific Jalali date. Use this for holidays that
 * move year to year — e.g. lunar (Hijri) holidays — by injecting one entry per year.
 */
export interface SpecificHolidayRule {
  type: 'specific';
  year: number;
  month: number;
  day: number;
  label: string;
  /** Free-form grouping tag, surfaced on {@link DayMeta.categories} for styling. */
  category?: string;
}

/**
 * A contiguous span of days off — a shutdown, a vacation, a market closure.
 * Expressing it directly avoids exploding a two-week closure into 14
 * `specific` rules.
 */
export interface RangeHolidayRule {
  type: 'range';
  start: JalaliDate;
  /** Inclusive: a range whose `start` and `end` are equal covers one day. */
  end: JalaliDate;
  label: string;
  /** Free-form grouping tag, surfaced on {@link DayMeta.categories} for styling. */
  category?: string;
}

export type HolidayRule =
  | RecurringHolidayRule
  | SpecificHolidayRule
  | RangeHolidayRule;

export interface HolidayConfig {
  /** Persian weekday indices treated as the weekly day(s) off (0 = Saturday … 6 = Friday). */
  weekends: number[];
  /** Public holidays and vacations. */
  rules: HolidayRule[];
}

/** What {@link resolveDayMeta} reports for a single day. */
export interface DayMeta {
  /**
   * Purely factual: the day's weekday is listed in `HolidayConfig.weekends`.
   * Whether that gets tinted is a styling decision the consumer owns — see the
   * picker's `tintWeekends` prop.
   */
  isWeekend: boolean;
  isHoliday: boolean;
  /** weekend OR holiday — i.e. the day is "off". */
  isOff: boolean;
  /** Labels of every holiday matched on this day. */
  labels: string[];
  /** The rules that matched, in config order — for callers needing more than a label. */
  matched: HolidayRule[];
  /** Distinct `category` values among `matched`, for styling one kind of day differently. */
  categories: string[];
}
