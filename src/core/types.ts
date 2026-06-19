/**
 * A calendar date expressed in the Jalali (Persian / Khorshidi) calendar.
 *
 * `month` is 1-based (1 = Farvardin … 12 = Esfand) and `day` is 1-based. This is
 * the only date shape exposed to consumers — the underlying dayjs instance never
 * leaks across the public API, so the package stays engine-agnostic.
 */
export interface JalaliDate {
  /** Jalali year, e.g. 1404. */
  year: number;
  /** Jalali month, 1-based: 1 = Farvardin … 12 = Esfand. */
  month: number;
  /** Day of month, 1-based. */
  day: number;
}

/**
 * A start/end pair for range selection. `end` is `null` while the user is still
 * picking the second endpoint; a committed range always has both set.
 */
export interface JalaliRange {
  start: JalaliDate;
  end: JalaliDate | null;
}

/** Which sub-view the calendar is showing. */
export type CalendarView = 'day' | 'month' | 'year';

/**
 * A single day produced by the pure grid builder, before it is enriched with
 * holiday / selection / disabled state by the React layer.
 */
export interface BaseDayCell {
  /** The day this cell represents. */
  date: JalaliDate;
  /** Stable React key, `${year}-${month}-${day}`. */
  key: string;
  /** Persian weekday index: 0 = Saturday … 6 = Friday. */
  weekday: number;
  /** True when the day belongs to the previous/next month (a leading/trailing "outside" day). */
  isOutside: boolean;
  /** True when the day is today. */
  isToday: boolean;
}
