'use client';

import type { JalaliDate, JalaliRange } from '../core/types';
import type { CommitMode } from '../react/useJalaliCalendar';
import { useJalaliCalendar } from '../react/useJalaliCalendar';
import type { HolidayConfig } from '../holidays/types';
import { cn } from '../utils/cn';
import { CalendarFooter } from './CalendarFooter';
import { CalendarHeader } from './CalendarHeader';
import { DayGrid } from './DayGrid';
import { MonthView } from './MonthView';
import { YearView } from './YearView';
import styles from './JalaliDatePicker.module.css';

interface CommonProps {
  className?: string;
  /** Render the footer (امروز / لغو / تأیید). Default `true`. */
  showFooter?: boolean;
  /** Render the "امروز" shortcut inside the footer. Default `true`. */
  showToday?: boolean;
  /** Fired when لغو is pressed (after the draft is reverted). */
  onCancel?: () => void;
  minDate?: JalaliDate | null;
  maxDate?: JalaliDate | null;
  disabledDate?: (date: JalaliDate) => boolean;
  holidays?: HolidayConfig;
  /** `'instant'` commits on click; `'confirm'` (default) stages until تأیید. */
  mode?: CommitMode;
}

interface SingleModeProps extends CommonProps {
  selectionMode?: 'single';
  value?: JalaliDate | null;
  defaultValue?: JalaliDate | null;
  onChange?: (value: JalaliDate) => void;
  onConfirm?: (value: JalaliDate | null) => void;
}

interface RangeModeProps extends CommonProps {
  selectionMode: 'range';
  value?: JalaliRange | null;
  defaultValue?: JalaliRange | null;
  onChange?: (value: JalaliRange) => void;
  onConfirm?: (value: JalaliRange | null) => void;
}

export type JalaliDatePickerProps = SingleModeProps | RangeModeProps;

/**
 * Inline Jalali calendar (single date or range). Self-contained and RTL by
 * construction (`dir="rtl"` is set on the root, independent of the host's
 * direction). Pair it with any popover/dialog/sheet to make a field — the
 * calendar itself takes no opinion on how it is presented.
 */
export function JalaliDatePicker(props: JalaliDatePickerProps) {
  const { className, showFooter = true, showToday = true } = props;

  const cal = useJalaliCalendar({
    selectionMode: props.selectionMode,
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onChange as
      | ((value: JalaliDate | JalaliRange) => void)
      | undefined,
    minDate: props.minDate,
    maxDate: props.maxDate,
    disabledDate: props.disabledDate,
    holidays: props.holidays,
    mode: props.mode,
  });

  const handleConfirm = () => {
    const result = cal.confirm();
    if (props.selectionMode === 'range') {
      props.onConfirm?.((result as JalaliRange | null) ?? null);
    } else {
      props.onConfirm?.((result as JalaliDate | null) ?? null);
    }
  };

  const handleCancel = () => {
    cal.reset();
    props.onCancel?.();
  };

  return (
    <div dir="rtl" className={cn(styles.root, className)}>
      <CalendarHeader cal={cal} />

      {cal.view === 'day' && (
        <DayGrid
          weeks={cal.weeks}
          weekdayLabels={cal.weekdayLabels}
          onSelect={cal.selectDay}
          onHover={cal.selectionMode === 'range' ? cal.hoverDay : undefined}
        />
      )}
      {cal.view === 'month' && (
        <MonthView options={cal.monthOptions} onSelect={cal.selectMonth} />
      )}
      {cal.view === 'year' && (
        <YearView options={cal.yearOptions} onSelect={cal.selectYear} />
      )}

      {showFooter && (
        <CalendarFooter
          showToday={showToday}
          onToday={cal.goToToday}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
