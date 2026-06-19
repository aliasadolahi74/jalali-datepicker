'use client';

import type { CalendarView } from '../core/types';
import type { UseJalaliCalendarResult } from '../react/useJalaliCalendar';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import styles from './JalaliDatePicker.module.css';

const PREV_LABEL: Record<CalendarView, string> = {
  day: 'ماه قبل',
  month: 'سال قبل',
  year: 'بازه قبل',
};
const NEXT_LABEL: Record<CalendarView, string> = {
  day: 'ماه بعد',
  month: 'سال بعد',
  year: 'بازه بعد',
};

// Header label click drills down: day → month → year → back to day.
const NEXT_VIEW: Record<CalendarView, CalendarView> = {
  day: 'month',
  month: 'year',
  year: 'day',
};

export function CalendarHeader({ cal }: { cal: UseJalaliCalendarResult }) {
  return (
    <div className={styles.header}>
      {/* Under dir="rtl" the first child renders on the right. The right-hand
          chevron moves backward in time (prev); the left-hand one moves forward. */}
      <button
        type="button"
        className={styles.navButton}
        onClick={cal.goPrev}
        disabled={!cal.canGoPrev}
        aria-label={PREV_LABEL[cal.view]}
      >
        <ChevronRightIcon className={styles.navIcon} />
      </button>

      <button
        type="button"
        className={styles.headerLabel}
        onClick={() => cal.setView(NEXT_VIEW[cal.view])}
        aria-live="polite"
      >
        {cal.headerLabel}
      </button>

      <button
        type="button"
        className={styles.navButton}
        onClick={cal.goNext}
        disabled={!cal.canGoNext}
        aria-label={NEXT_LABEL[cal.view]}
      >
        <ChevronLeftIcon className={styles.navIcon} />
      </button>
    </div>
  );
}
