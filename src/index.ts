/**
 * Jalali Date Picker — public API.
 *
 * Self-contained, RTL-first Persian (Jalali) calendar. This barrel is the only
 * intended import surface; nothing here depends on the host application, so the
 * `jalali-datepicker` folder can be lifted into a standalone npm package as-is.
 */

// ----- Styled component -----
export { JalaliDatePicker } from './components/JalaliDatePicker';
export type { JalaliDatePickerProps } from './components/JalaliDatePicker';

// ----- Headless hook (build your own UI on top) -----
export { useJalaliCalendar } from './react/useJalaliCalendar';
export type {
  UseJalaliCalendarOptions,
  UseJalaliCalendarResult,
  EnrichedDayCell,
  MonthOption,
  YearOption,
  SelectionKind,
  CommitMode,
  JalaliSelection,
} from './react/useJalaliCalendar';

// ----- Output adapters: convert a selection to timestamp / Gregorian / Jalali -----
export {
  toDate,
  toTimestamp,
  toGregorian,
  toJalali,
  fromDate,
  fromTimestamp,
  fromGregorian,
} from './format/convert';
export type { TimestampOptions, JalaliFormatOptions } from './format/convert';
export { toPersianDigits, toLatinDigits } from './format/digits';

// ----- Core calendar math (for custom UIs) -----
export {
  todayJalali,
  daysInMonth,
  isLeapYear,
  persianWeekday,
  addMonths,
  compareJalali,
  isSameDay,
  clampToRange,
  buildMonthGrid,
} from './core/calendar';
export {
  JALALI_MONTHS,
  PERSIAN_WEEKDAYS_LONG,
  PERSIAN_WEEKDAYS_SHORT,
} from './core/constants';
export type {
  JalaliDate,
  JalaliRange,
  CalendarView,
  BaseDayCell,
} from './core/types';

// ----- Holidays / days off (injectable config) -----
export { resolveDayMeta } from './holidays/resolve';
export { IRAN_HOLIDAYS } from './holidays/iran.holidays';
export type {
  HolidayConfig,
  HolidayRule,
  RecurringHolidayRule,
  SpecificHolidayRule,
  DayMeta,
} from './holidays/types';
