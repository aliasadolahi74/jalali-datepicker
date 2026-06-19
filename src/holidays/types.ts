/**
 * The injectable "days off" configuration model. Consumers supply a
 * {@link HolidayConfig} (see `iran.holidays.ts` for the default) to mark
 * weekends, public holidays, and vacations — without touching the picker.
 */

/** A holiday that recurs on the same Jalali month/day every year (a fixed solar holiday). */
export interface RecurringHolidayRule {
  type: 'recurring';
  /** Jalali month, 1-based. */
  month: number;
  /** Day of month, 1-based. */
  day: number;
  label: string;
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
}

export type HolidayRule = RecurringHolidayRule | SpecificHolidayRule;

export interface HolidayConfig {
  /** Persian weekday indices treated as the weekly day(s) off (0 = Saturday … 6 = Friday). */
  weekends: number[];
  /** Public holidays and vacations. */
  rules: HolidayRule[];
}

/** What {@link resolveDayMeta} reports for a single day. */
export interface DayMeta {
  isWeekend: boolean;
  isHoliday: boolean;
  /** weekend OR holiday — i.e. the day is "off". */
  isOff: boolean;
  /** Labels of every holiday matched on this day. */
  labels: string[];
}
