import type { JalaliDate } from '../core/types';

/**
 * A thing that happened (or will happen) on a given day. Each event a day holds
 * renders as one small circle badge beneath the day number, so a day with three
 * events shows three dots.
 *
 * Events are deliberately separate from the holiday config: a holiday says the
 * day is *off*, an event only says something is *on* it.
 */
export interface DayEvent {
  date: JalaliDate;
  /** Surfaced in the cell's tooltip and accessible name. */
  label?: string;
  /** Any CSS color. Overrides `--jdp-badge-color` for this badge only. */
  color?: string;
  /** Extra class on the badge element, for consumer stylesheets. */
  className?: string;
  /** Stable React key. Falls back to the badge's position when absent. */
  id?: string;
}
