'use client';

import type { JalaliDate, JalaliRange } from '../core/types';
import type {
  CommitMode,
  UseJalaliCalendarResult,
} from '../react/useJalaliCalendar';
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

function JalaliDatePickerBody({
  cal,
  className,
  showFooter,
  showToday,
  onConfirm,
  onCancel,
}: {
  cal: UseJalaliCalendarResult;
  className?: string;
  showFooter: boolean;
  showToday: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
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
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}

function JalaliDatePickerSingle(props: SingleModeProps) {
  const { className, showFooter = true, showToday = true } = props;

  const cal = useJalaliCalendar({
    selectionMode: 'single',
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onChange,
    minDate: props.minDate,
    maxDate: props.maxDate,
    disabledDate: props.disabledDate,
    holidays: props.holidays,
    mode: props.mode,
  });

  return (
    <JalaliDatePickerBody
      cal={cal}
      className={className}
      showFooter={showFooter}
      showToday={showToday}
      onConfirm={() => props.onConfirm?.(cal.confirm())}
      onCancel={() => {
        cal.reset();
        props.onCancel?.();
      }}
    />
  );
}

function JalaliDatePickerRange(props: RangeModeProps) {
  const { className, showFooter = true, showToday = true } = props;

  const cal = useJalaliCalendar({
    selectionMode: 'range',
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onChange,
    minDate: props.minDate,
    maxDate: props.maxDate,
    disabledDate: props.disabledDate,
    holidays: props.holidays,
    mode: props.mode,
  });

  return (
    <JalaliDatePickerBody
      cal={cal}
      className={className}
      showFooter={showFooter}
      showToday={showToday}
      onConfirm={() => props.onConfirm?.(cal.confirm())}
      onCancel={() => {
        cal.reset();
        props.onCancel?.();
      }}
    />
  );
}

/**
 * Inline Jalali calendar (single date or range). Self-contained and RTL by
 * construction (`dir="rtl"` is set on the root, independent of the host's
 * direction). Pair it with any popover/dialog/sheet to make a field — the
 * calendar itself takes no opinion on how it is presented.
 */
export function JalaliDatePicker(props: JalaliDatePickerProps) {
  if (props.selectionMode === 'range') {
    return <JalaliDatePickerRange {...props} />;
  }
  return <JalaliDatePickerSingle {...props} />;
}
