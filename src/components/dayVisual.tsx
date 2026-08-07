'use client';

/**
 * The presentational core of a day cell, shared by the interactive picker grid
 * and the read-only {@link JalaliMonthGrid}.
 *
 * Nothing here knows about selection, focus, or ARIA roles — it only decides
 * what a day *looks* like and what text describes it. Keeping it in one place is
 * what stops the two grids from drifting apart visually, which is the whole
 * reason consumers used to fork the grid rather than reuse it.
 */
import { JALALI_MONTHS, PERSIAN_WEEKDAYS_LONG } from '../core/constants';
import type { BaseDayCell } from '../core/types';
import type { DayEvent } from '../events/types';
import { toPersianDigits } from '../format/digits';
import { cn } from '../utils/cn';
import styles from './JalaliDatePicker.module.css';

/** The visual flags a day cell can carry, independent of how it is rendered. */
export interface DayVisualState {
  isOutside: boolean;
  isToday: boolean;
  /** Painted with `--jdp-off-fg`. Not the same as "is off" — see `tintWeekends`. */
  isTinted: boolean;
  /** Range mode only; always false in the read-only grid. */
  isInRange?: boolean;
  /** Selection is a picker concern; always false in the read-only grid. */
  isSelected?: boolean;
}

/**
 * "Off" is factual; tinting is a styling choice. With `tintWeekends: false` a
 * consumer keeps the package's weekend knowledge but paints weekends itself —
 * holidays stay tinted either way, so the two remain distinguishable.
 */
export function isDayTinted(
  { isHoliday, isWeekend }: { isHoliday: boolean; isWeekend: boolean },
  tintWeekends: boolean,
): boolean {
  return isHoliday || (isWeekend && tintWeekends);
}

/** The class list for a day cell. One definition, so both grids look identical. */
export function dayClassName(state: DayVisualState): string {
  return cn(
    styles.day,
    state.isOutside && styles.dayOutside,
    state.isTinted && styles.dayOff,
    state.isInRange && !state.isSelected && styles.dayInRange,
    state.isToday && styles.dayToday,
    state.isSelected && styles.daySelected,
  );
}

/**
 * The accessible name and tooltip for a day. Built from constants — no per-cell
 * date conversion — so a 42-cell grid stays cheap.
 */
export function dayText(
  cell: BaseDayCell,
  holidayLabels: readonly string[],
  events: readonly DayEvent[],
): { label: string; tooltip: string } {
  // Every event's label, including ones whose badge is truncated away: the
  // badges are decorative, so this text is the only channel carrying the detail.
  const eventLabels = events
    .map((event) => event.label)
    .filter((label): label is string => Boolean(label));

  return {
    label: [
      PERSIAN_WEEKDAYS_LONG[cell.weekday],
      `${toPersianDigits(cell.date.day)} ${JALALI_MONTHS[cell.date.month - 1]} ${toPersianDigits(cell.date.year)}`,
      ...holidayLabels,
      ...eventLabels,
    ].join('، '),
    tooltip: [...holidayLabels, ...eventLabels].join('، '),
  };
}

interface DayContentProps {
  day: number;
  events: readonly DayEvent[];
  maxBadges: number;
}

/** The inside of a day cell: the number, plus one badge per event. */
export function DayContent({ day, events, maxBadges }: DayContentProps) {
  return (
    <>
      <span className={styles.dayNumber}>{toPersianDigits(day)}</span>
      {events.length > 0 && maxBadges > 0 && (
        <span className={styles.badges} aria-hidden="true">
          {events.slice(0, maxBadges).map((event, index) => (
            <span
              key={event.id ?? index}
              className={cn(styles.badge, event.className)}
              style={event.color ? { background: event.color } : undefined}
            />
          ))}
        </span>
      )}
    </>
  );
}
