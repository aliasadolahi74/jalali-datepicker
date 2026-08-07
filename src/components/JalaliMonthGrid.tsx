'use client';

/**
 * A presentational Jalali month: the weekday header and the day cells, and
 * nothing else. No month/year drill-down, no navigation, no footer, no
 * selection — the chrome a display calendar has to strip out before it can show
 * data on a month.
 *
 * It shares its day rendering with the picker (see `dayVisual`), so the two can
 * never drift visually, and it is inert unless `onDayClick` is supplied: no
 * `role="grid"`, no tab stops, no key handlers, nothing for a screen reader to
 * announce as an interactive widget.
 */
import type { ReactNode } from 'react';

import { buildMonthGrid } from '../core/calendar';
import { PERSIAN_WEEKDAYS_SHORT } from '../core/constants';
import type { BaseDayCell, JalaliDate } from '../core/types';
import type { DayEvent } from '../events/types';
import { groupEventsByDay } from '../events/group';
import { resolveDayMeta } from '../holidays/resolve';
import type { DayMeta, HolidayConfig } from '../holidays/types';
import { IRAN_HOLIDAYS } from '../holidays/iran.holidays';
import { cn } from '../utils/cn';
import type { DayClickInfo } from './dayClick';
import { DayContent, dayClassName, dayText, isDayTinted } from './dayVisual';
import styles from './JalaliDatePicker.module.css';

export interface JalaliMonthGridProps {
  year: number;
  /** 1-based: 1 = فروردین … 12 = اسفند. */
  month: number;
  /** Weekend + holiday configuration. Defaults to {@link IRAN_HOLIDAYS}. */
  holidays?: HolidayConfig;
  /** Days to mark with badges. Hoist or memoize the array. */
  events?: readonly DayEvent[];
  /** Badges drawn per day before truncating. Default `3`. */
  maxBadgesPerDay?: number;
  /**
   * `'fixed'` (default) always renders six weeks, matching the picker's stable
   * height. `'auto'` renders only the weeks the month actually touches.
   */
  weeks?: 'fixed' | 'auto';
  /**
   * What counts as today, i.e. which cell gets the today ring. Defaults to the
   * ambient timezone — inject it for a calendar that means a fixed locale, or to
   * keep a server and client render agreeing. `null` marks no day.
   */
  today?: JalaliDate | null;
  /** Paint weekends with `--jdp-off-fg`. Default `true`. Holidays are painted regardless. */
  tintWeekends?: boolean;
  /** Render the ش…ج header row. Default `true`. */
  showWeekdayHeader?: boolean;
  /** Replace a cell's contents entirely. The cell keeps its own tinting and layout. */
  renderDay?: (cell: BaseDayCell, meta: DayMeta) => ReactNode;
  /**
   * Omit for a fully inert calendar. Supplying it turns each day into a real
   * button — the only thing that makes the grid interactive.
   */
  onDayClick?: (info: DayClickInfo) => void;
  className?: string;
}

const NO_EVENTS: DayEvent[] = [];

export function JalaliMonthGrid({
  year,
  month,
  holidays = IRAN_HOLIDAYS,
  events,
  maxBadgesPerDay = 3,
  weeks = 'fixed',
  today,
  tintWeekends = true,
  showWeekdayHeader = true,
  renderDay,
  onDayClick,
  className,
}: JalaliMonthGridProps) {
  // Cheap enough to do inline: buildMonthGrid is pure arithmetic and the event
  // index is one pass. Memoizing here would only trade that for a dep array
  // that consumers would have to keep stable anyway.
  const grid = buildMonthGrid(year, month, { weeks, today });
  const eventsByDay = events?.length ? groupEventsByDay(events) : null;
  const interactive = Boolean(onDayClick);

  return (
    <div dir="rtl" lang="fa" className={cn(styles.gridRoot, className)}>
      {showWeekdayHeader && (
        <div className={styles.weekdays} aria-hidden="true">
          {PERSIAN_WEEKDAYS_SHORT.map((label, index) => (
            <span
              key={label}
              className={cn(
                styles.weekday,
                tintWeekends &&
                  holidays.weekends.includes(index) &&
                  styles.weekdayOff,
              )}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className={styles.grid}>
        {grid.map((week, weekIndex) => (
          <div key={weekIndex} className={styles.row}>
            {week.map((cell) => {
              const meta = resolveDayMeta(cell.date, cell.weekday, holidays);
              const dayEvents = eventsByDay?.get(cell.key) ?? NO_EVENTS;
              const { label, tooltip } = dayText(cell, meta.labels, dayEvents);

              const classes = cn(
                dayClassName({
                  isOutside: cell.isOutside,
                  isToday: cell.isToday,
                  isTinted: isDayTinted(meta, tintWeekends),
                }),
                !interactive && styles.dayStatic,
              );

              const content = renderDay ? (
                renderDay(cell, meta)
              ) : (
                <DayContent
                  day={cell.date.day}
                  events={dayEvents}
                  maxBadges={maxBadgesPerDay}
                />
              );

              const shared = {
                'data-key': cell.key,
                'data-holiday-categories':
                  meta.categories.join(' ') || undefined,
                title: tooltip || undefined,
                className: classes,
              };

              // Inert: a plain div with no role, no tab stop, no handlers. AT
              // reads the date text and moves on.
              if (!interactive) {
                return (
                  <div key={cell.key} {...shared}>
                    {content}
                  </div>
                );
              }

              return (
                <button
                  key={cell.key}
                  type="button"
                  {...shared}
                  aria-label={label}
                  aria-current={cell.isToday ? 'date' : undefined}
                  onClick={() =>
                    onDayClick?.({
                      date: cell.date,
                      events: dayEvents,
                      holidayLabels: meta.labels,
                      holidayCategories: meta.categories,
                      isWeekend: meta.isWeekend,
                      isHoliday: meta.isHoliday,
                      isOff: meta.isOff,
                      isToday: cell.isToday,
                      isOutside: cell.isOutside,
                    })
                  }
                >
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
