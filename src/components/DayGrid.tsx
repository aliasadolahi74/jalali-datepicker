'use client';

import { type KeyboardEvent, useMemo, useRef, useState } from 'react';

import { DAYS_IN_WEEK, FRIDAY_INDEX } from '../core/constants';
import type { JalaliDate } from '../core/types';
import type { EnrichedDayCell } from '../react/useJalaliCalendar';
import { cn } from '../utils/cn';
import { DayCell } from './DayCell';
import styles from './JalaliDatePicker.module.css';

interface DayGridProps {
  weeks: EnrichedDayCell[][];
  weekdayLabels: readonly string[];
  onSelect: (cell: EnrichedDayCell) => void;
  /** Range mode: called with the hovered day (and `null` when the pointer leaves the grid). */
  onHover?: (date: JalaliDate | null) => void;
}

export function DayGrid({
  weeks,
  weekdayLabels,
  onSelect,
  onHover,
}: DayGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const cells = useMemo(() => weeks.flat(), [weeks]);

  // The single cell that holds tabIndex 0 (roving tabindex, WAI-ARIA grid pattern):
  // prefer the selection, then today, then the first selectable day.
  const fallbackKey = useMemo(() => {
    const selected = cells.find((cell) => cell.isSelected && !cell.isDisabled);
    if (selected) return selected.key;
    const today = cells.find(
      (cell) => cell.isToday && !cell.isOutside && !cell.isDisabled,
    );
    if (today) return today.key;
    const firstEnabled = cells.find(
      (cell) => !cell.isOutside && !cell.isDisabled,
    );
    return (firstEnabled ?? cells[0])?.key ?? null;
  }, [cells]);

  const activeIsValid =
    activeKey != null && cells.some((cell) => cell.key === activeKey);
  const active = activeIsValid ? activeKey : fallbackKey;

  const focusByKey = (key: string) => {
    gridRef.current
      ?.querySelector<HTMLButtonElement>(`[data-key="${key}"]`)
      ?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = cells.findIndex((cell) => cell.key === active);
    if (index < 0) return;

    let next = index;
    switch (event.key) {
      // RTL: the visually-left cell is the *next* day (a higher array index).
      case 'ArrowLeft':
        next = index + 1;
        break;
      case 'ArrowRight':
        next = index - 1;
        break;
      case 'ArrowUp':
        next = index - DAYS_IN_WEEK;
        break;
      case 'ArrowDown':
        next = index + DAYS_IN_WEEK;
        break;
      case 'Home':
        next = index - (index % DAYS_IN_WEEK);
        break;
      case 'End':
        next = index - (index % DAYS_IN_WEEK) + (DAYS_IN_WEEK - 1);
        break;
      default:
        return;
    }

    if (next < 0 || next >= cells.length) return;
    event.preventDefault();
    const key = cells[next].key;
    setActiveKey(key);
    focusByKey(key);
  };

  return (
    <div>
      <div className={styles.weekdays} aria-hidden="true">
        {weekdayLabels.map((label, index) => (
          <span
            key={label}
            className={cn(
              styles.weekday,
              index === FRIDAY_INDEX && styles.weekdayOff,
            )}
          >
            {label}
          </span>
        ))}
      </div>

      <div
        ref={gridRef}
        role="grid"
        className={styles.grid}
        onKeyDown={handleKeyDown}
        onMouseLeave={onHover ? () => onHover(null) : undefined}
      >
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} role="row" className={styles.row}>
            {week.map((cell) => (
              <DayCell
                key={cell.key}
                cell={cell}
                tabIndex={cell.key === active ? 0 : -1}
                onSelect={onSelect}
                onFocus={setActiveKey}
                onHover={onHover}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
