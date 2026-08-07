'use client';

import type { JalaliDate } from '../core/types';
import type { EnrichedDayCell } from '../react/useJalaliCalendar';
import { DayContent, dayClassName, dayText, isDayTinted } from './dayVisual';

interface DayCellProps {
  cell: EnrichedDayCell;
  tabIndex: number;
  /** How many badges to draw before truncating. */
  maxBadges: number;
  /** Whether weekends get the "off" tint. Holidays are tinted either way. */
  tintWeekends: boolean;
  onSelect: (cell: EnrichedDayCell) => void;
  onFocus: (key: string) => void;
  onHover?: (date: JalaliDate) => void;
}

/**
 * The interactive day cell: a real button inside the picker's `role="grid"`,
 * carrying selection, focus and hover. The look comes entirely from `dayVisual`,
 * which the read-only grid shares.
 */
export function DayCell({
  cell,
  tabIndex,
  maxBadges,
  tintWeekends,
  onSelect,
  onFocus,
  onHover,
}: DayCellProps) {
  const { label, tooltip } = dayText(cell, cell.holidayLabels, cell.events);

  return (
    <button
      type="button"
      role="gridcell"
      data-key={cell.key}
      data-holiday-categories={cell.holidayCategories.join(' ') || undefined}
      tabIndex={tabIndex}
      disabled={cell.isDisabled}
      aria-selected={cell.isSelected}
      aria-current={cell.isToday ? 'date' : undefined}
      aria-label={label}
      title={tooltip || undefined}
      onClick={() => onSelect(cell)}
      onFocus={() => onFocus(cell.key)}
      onMouseEnter={onHover ? () => onHover(cell.date) : undefined}
      className={dayClassName({
        isOutside: cell.isOutside,
        isToday: cell.isToday,
        isTinted: isDayTinted(cell, tintWeekends),
        isInRange: cell.isInRange,
        isSelected: cell.isSelected,
      })}
    >
      <DayContent
        day={cell.date.day}
        events={cell.events}
        maxBadges={maxBadges}
      />
    </button>
  );
}
