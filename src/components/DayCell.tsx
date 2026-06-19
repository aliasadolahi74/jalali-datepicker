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
  onSelect: (cell: EnrichedDayCell) => void;
  onFocus: (key: string) => void;
  onHover?: (date: JalaliDate) => void;
}

export function DayCell({
  cell,
  tabIndex,
  onSelect,
  onFocus,
  onHover,
}: DayCellProps) {
  // Built from constants (no per-cell date conversion) to keep 42 cells cheap.
  const label = [
    PERSIAN_WEEKDAYS_LONG[cell.weekday],
    `${toPersianDigits(cell.date.day)} ${JALALI_MONTHS[cell.date.month - 1]} ${toPersianDigits(cell.date.year)}`,
    ...cell.holidayLabels,
  ].join('، ');

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
      title={cell.holidayLabels.join('، ') || undefined}
      onClick={() => onSelect(cell)}
      onFocus={() => onFocus(cell.key)}
      onMouseEnter={onHover ? () => onHover(cell.date) : undefined}
      className={cn(
        styles.day,
        cell.isOutside && styles.dayOutside,
        cell.isOff && styles.dayOff,
        cell.isInRange && !cell.isSelected && styles.dayInRange,
        cell.isToday && styles.dayToday,
        cell.isSelected && styles.daySelected
      )}
    >
      {toPersianDigits(cell.date.day)}
    </button>
  );
}
