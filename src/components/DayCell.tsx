'use client';

import { JALALI_MONTHS, PERSIAN_WEEKDAYS_LONG } from '../core/constants';
import type { JalaliDate } from '../core/types';
import { toPersianDigits } from '../format/digits';
import type { EnrichedDayCell } from '../react/useJalaliCalendar';
import { cn } from '../utils/cn';
import styles from './JalaliDatePicker.module.css';

interface DayCellProps {
  cell: EnrichedDayCell;
  tabIndex: number;
  /** How many badges to draw before truncating. */
  maxBadges: number;
  onSelect: (cell: EnrichedDayCell) => void;
  onFocus: (key: string) => void;
  onHover?: (date: JalaliDate) => void;
}

export function DayCell({
  cell,
  tabIndex,
  maxBadges,
  onSelect,
  onFocus,
  onHover,
}: DayCellProps) {
  // Every event's label, even those whose badge is truncated away — the badges
  // are decorative, so this text is the only channel that carries the detail.
  const eventLabels = cell.events
    .map((event) => event.label)
    .filter((label): label is string => Boolean(label));

  // Built from constants (no per-cell date conversion) to keep 42 cells cheap.
  const label = [
    PERSIAN_WEEKDAYS_LONG[cell.weekday],
    `${toPersianDigits(cell.date.day)} ${JALALI_MONTHS[cell.date.month - 1]} ${toPersianDigits(cell.date.year)}`,
    ...cell.holidayLabels,
    ...eventLabels,
  ].join('، ');

  const tooltip = [...cell.holidayLabels, ...eventLabels].join('، ');

  return (
    <button
      type="button"
      role="gridcell"
      data-key={cell.key}
      tabIndex={tabIndex}
      disabled={cell.isDisabled}
      aria-selected={cell.isSelected}
      aria-current={cell.isToday ? 'date' : undefined}
      aria-label={label}
      title={tooltip || undefined}
      onClick={() => onSelect(cell)}
      onFocus={() => onFocus(cell.key)}
      onMouseEnter={onHover ? () => onHover(cell.date) : undefined}
      className={cn(
        styles.day,
        cell.isOutside && styles.dayOutside,
        cell.isOff && styles.dayOff,
        cell.isInRange && !cell.isSelected && styles.dayInRange,
        cell.isToday && styles.dayToday,
        cell.isSelected && styles.daySelected,
      )}
    >
      <span className={styles.dayNumber}>{toPersianDigits(cell.date.day)}</span>
      {cell.events.length > 0 && maxBadges > 0 && (
        <span className={styles.badges} aria-hidden="true">
          {cell.events.slice(0, maxBadges).map((event, index) => (
            <span
              key={event.id ?? index}
              className={cn(styles.badge, event.className)}
              style={event.color ? { background: event.color } : undefined}
            />
          ))}
        </span>
      )}
    </button>
  );
}
