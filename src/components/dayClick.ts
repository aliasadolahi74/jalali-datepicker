import type { JalaliDate } from '../core/types';
import type { DayEvent } from '../events/types';

/**
 * Everything known about the day that was clicked, at click time. Shared by
 * `JalaliDatePicker` and `JalaliMonthGrid` so a consumer can move between the
 * two without rewriting the handler.
 *
 * Selection state is deliberately absent — it is mid-update when this fires in
 * the picker, and meaningless in the read-only grid. The committed value arrives
 * through `onChange` / `onConfirm` instead.
 */
export interface DayClickInfo {
  date: JalaliDate;
  /** Events falling on this day (empty when there are none). */
  events: DayEvent[];
  /** Labels of every holiday rule that matched this day. */
  holidayLabels: string[];
  /** Distinct `category` values among the matched holiday rules. */
  holidayCategories: string[];
  isWeekend: boolean;
  isHoliday: boolean;
  /** Weekend or holiday. */
  isOff: boolean;
  isToday: boolean;
  /** The day belongs to the previous/next month (a leading/trailing grid cell). */
  isOutside: boolean;
}
