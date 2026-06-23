'use client';

/**
 * Headless calendar engine. Holds all picker state — selection (single or range,
 * controlled or uncontrolled), the visible month "cursor", the day/month/year
 * view, navigation, hover preview, and range/disable logic — and produces a fully
 * enriched grid. It renders nothing, so any UI (the bundled one, or a consumer's
 * own) can be built on top.
 */
import { useCallback, useMemo, useState } from 'react';

import {
  addMonths,
  buildMonthGrid,
  compareJalali,
  daysInMonth,
  isSameDay,
  todayJalali,
} from '../core/calendar';
import { JALALI_MONTHS, PERSIAN_WEEKDAYS_SHORT } from '../core/constants';
import type {
  BaseDayCell,
  CalendarView,
  JalaliDate,
  JalaliRange,
} from '../core/types';
import { toPersianDigits } from '../format/digits';
import { resolveDayMeta } from '../holidays/resolve';
import type { HolidayConfig } from '../holidays/types';
import { IRAN_HOLIDAYS } from '../holidays/iran.holidays';

const YEARS_PER_PAGE = 12;

/** `'single'` selects one date; `'range'` selects a start/end pair. */
export type SelectionKind = 'single' | 'range';

/** When the selection commits: `'instant'` on click, `'confirm'` on `confirm()`. */
export type CommitMode = 'instant' | 'confirm';

/** Whatever the calendar currently holds, depending on {@link SelectionKind}. */
export type JalaliSelection = JalaliDate | JalaliRange | null;

/** Committed/staged value for a given {@link SelectionKind}. */
export type SelectionForMode<M extends SelectionKind> = M extends 'range'
  ? JalaliRange | null
  : JalaliDate | null;

interface UseJalaliCalendarOptionsBase {
  minDate?: JalaliDate | null;
  maxDate?: JalaliDate | null;
  /** Return `true` to disable a specific day. */
  disabledDate?: (date: JalaliDate) => boolean;
  /** Weekend + holiday configuration (defaults to {@link IRAN_HOLIDAYS}). */
  holidays?: HolidayConfig;
  /** `'instant'` commits on click; `'confirm'` stages a draft until `confirm()`. Default `'confirm'`. */
  mode?: CommitMode;
}

export interface UseJalaliCalendarSingleOptions extends UseJalaliCalendarOptionsBase {
  /** Single date selection. Default `'single'`. */
  selectionMode?: 'single';
  value?: JalaliDate | null;
  defaultValue?: JalaliDate | null;
  /** Fired when a value is committed (immediately in `instant` mode, on `confirm()` in `confirm` mode). */
  onChange?: (value: JalaliDate) => void;
}

export interface UseJalaliCalendarRangeOptions extends UseJalaliCalendarOptionsBase {
  selectionMode: 'range';
  value?: JalaliRange | null;
  defaultValue?: JalaliRange | null;
  onChange?: (value: JalaliRange) => void;
}

export type UseJalaliCalendarOptions =
  | UseJalaliCalendarSingleOptions
  | UseJalaliCalendarRangeOptions;

export interface EnrichedDayCell extends BaseDayCell {
  isSelected: boolean;
  isDisabled: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  isOff: boolean;
  holidayLabels: string[];
  /** Range mode: this day is the (lower) start endpoint. */
  isRangeStart: boolean;
  /** Range mode: this day is the (upper) end endpoint. */
  isRangeEnd: boolean;
  /** Range mode: this day lies within the selected/previewed span (endpoints included). */
  isInRange: boolean;
}

export interface MonthOption {
  month: number;
  label: string;
  isSelected: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
}

export interface YearOption {
  year: number;
  label: string;
  isSelected: boolean;
  isCurrent: boolean;
  isDisabled: boolean;
}

interface UseJalaliCalendarResultBase {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  cursor: { year: number; month: number };
  headerLabel: string;
  weekdayLabels: readonly string[];
  weeks: EnrichedDayCell[][];
  monthOptions: MonthOption[];
  yearOptions: YearOption[];
  goPrev: () => void;
  goNext: () => void;
  goToToday: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  selectDay: (cell: BaseDayCell) => void;
  selectMonth: (month: number) => void;
  selectYear: (year: number) => void;
  /** Range mode only: set the hovered day to preview the in-progress span (pass `null` to clear). */
  hoverDay: (date: JalaliDate | null) => void;
  isConfirmMode: boolean;
  /** Revert the staged selection back to the committed value (used for "cancel"). */
  reset: () => void;
}

export type UseJalaliCalendarResult<M extends SelectionKind = SelectionKind> =
  UseJalaliCalendarResultBase & {
    selectionMode: M;
    selected: SelectionForMode<M>;
    /** Commit the staged selection. Returns it (or null). */
    confirm: () => SelectionForMode<M>;
  };

const pageStartFor = (year: number): number =>
  year - (((year % YEARS_PER_PAGE) + YEARS_PER_PAGE) % YEARS_PER_PAGE);

const isRange = (value: JalaliSelection): value is JalaliRange =>
  value !== null && 'start' in value;

/** The concrete dates a selection touches (0, 1, or 2). */
const selectionDates = (value: JalaliSelection): JalaliDate[] => {
  if (!value) return [];
  if (isRange(value))
    return value.end ? [value.start, value.end] : [value.start];
  return [value];
};

const dateKey = (date: JalaliDate): string =>
  `${date.year}-${date.month}-${date.day}`;

const selectionKey = (value: JalaliSelection): string =>
  selectionDates(value).map(dateKey).join('|') || 'none';

export function useJalaliCalendar(
  options?: UseJalaliCalendarSingleOptions,
): UseJalaliCalendarResult<'single'>;
export function useJalaliCalendar(
  options: UseJalaliCalendarRangeOptions,
): UseJalaliCalendarResult<'range'>;
export function useJalaliCalendar(
  options: UseJalaliCalendarOptions = {},
): UseJalaliCalendarResult {
  const {
    selectionMode = 'single',
    value,
    defaultValue = null,
    minDate = null,
    maxDate = null,
    disabledDate,
    holidays = IRAN_HOLIDAYS,
    mode = 'confirm',
  } = options;

  const isControlled = value !== undefined;

  // Committed value for the uncontrolled case.
  const [internalCommitted, setInternalCommitted] =
    useState<JalaliSelection>(defaultValue);
  const committedValue = isControlled ? (value ?? null) : internalCommitted;

  // The staged selection (highlighted in the grid). Equal to the committed value
  // in instant mode; may differ from it in confirm mode until confirm()/reset().
  const [selected, setSelected] = useState<JalaliSelection>(committedValue);
  // Range mode: the day currently hovered while picking the second endpoint.
  const [hoverDate, setHoverDate] = useState<JalaliDate | null>(null);

  const firstSelectedDate = selectionDates(committedValue)[0] ?? null;
  const initialCursor = firstSelectedDate ?? todayJalali();
  const [cursor, setCursor] = useState<{ year: number; month: number }>({
    year: initialCursor.year,
    month: initialCursor.month,
  });
  const [view, setView] = useState<CalendarView>('day');

  // Keep the staged selection and cursor in sync when the committed value changes
  // (a controlled `value` update, or our own commit). This is the React-blessed
  // "adjust state during render" pattern — not an effect — so it stays cheap and
  // free of cascading-render warnings.
  const committedKey = selectionKey(committedValue);
  const [syncedKey, setSyncedKey] = useState(committedKey);
  if (syncedKey !== committedKey) {
    setSyncedKey(committedKey);
    setSelected(committedValue);
    const anchor = selectionDates(committedValue)[0];
    if (anchor) setCursor({ year: anchor.year, month: anchor.month });
  }

  const isDayDisabled = useCallback(
    (date: JalaliDate): boolean => {
      if (minDate && compareJalali(date, minDate) < 0) return true;
      if (maxDate && compareJalali(date, maxDate) > 0) return true;
      return disabledDate ? disabledDate(date) : false;
    },
    [minDate, maxDate, disabledDate],
  );

  const grid = useMemo(
    () => buildMonthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

  // Normalize the current selection (plus any hover preview) into ordered
  // lo/hi bounds used to flag range cells.
  const [rangeLo, rangeHi] = useMemo<
    [JalaliDate | null, JalaliDate | null]
  >(() => {
    if (selectionMode !== 'range' || !isRange(selected)) return [null, null];
    const start = selected.start;
    const end = selected.end ?? hoverDate;
    if (!end) return [start, null];
    return compareJalali(end, start) < 0 ? [end, start] : [start, end];
  }, [selectionMode, selected, hoverDate]);

  const singleSelected =
    selectionMode === 'single' && !isRange(selected) ? selected : null;

  const weeks = useMemo<EnrichedDayCell[][]>(
    () =>
      grid.map((week) =>
        week.map((cell) => {
          const meta = resolveDayMeta(cell.date, cell.weekday, holidays);
          const isRangeStart = rangeLo ? isSameDay(cell.date, rangeLo) : false;
          const isRangeEnd = rangeHi ? isSameDay(cell.date, rangeHi) : false;
          const isInRange =
            rangeLo && rangeHi
              ? compareJalali(cell.date, rangeLo) >= 0 &&
                compareJalali(cell.date, rangeHi) <= 0
              : isRangeStart;
          return {
            ...cell,
            isSelected:
              selectionMode === 'range'
                ? isRangeStart || isRangeEnd
                : isSameDay(cell.date, singleSelected),
            isDisabled: isDayDisabled(cell.date),
            isWeekend: meta.isWeekend,
            isHoliday: meta.isHoliday,
            isOff: meta.isOff,
            holidayLabels: meta.labels,
            isRangeStart,
            isRangeEnd,
            isInRange,
          };
        }),
      ),
    [
      grid,
      selectionMode,
      singleSelected,
      rangeLo,
      rangeHi,
      isDayDisabled,
      holidays,
    ],
  );

  const commitDate = useCallback(
    (next: JalaliDate) => {
      if (!isControlled) setInternalCommitted(next);
      if (options.selectionMode !== 'range') {
        options.onChange?.(next);
      }
    },
    [isControlled, options],
  );

  const commitRange = useCallback(
    (next: JalaliRange) => {
      if (!isControlled) setInternalCommitted(next);
      if (options.selectionMode === 'range') {
        options.onChange?.(next);
      }
    },
    [isControlled, options],
  );

  const moveCursorToCell = useCallback(
    (cell: BaseDayCell) => {
      if (cell.date.month !== cursor.month || cell.date.year !== cursor.year) {
        setCursor({ year: cell.date.year, month: cell.date.month });
      }
    },
    [cursor.month, cursor.year],
  );

  const selectDay = useCallback(
    (cell: BaseDayCell) => {
      if (isDayDisabled(cell.date)) return;

      if (selectionMode === 'range') {
        const current = isRange(selected) ? selected : null;
        let next: JalaliRange;
        if (!current || current.end != null) {
          next = { start: cell.date, end: null }; // begin a new range
        } else if (compareJalali(cell.date, current.start) < 0) {
          next = { start: cell.date, end: current.start }; // clicked before start → swap
        } else {
          next = { start: current.start, end: cell.date }; // complete the range
        }
        setSelected(next);
        setHoverDate(null);
        moveCursorToCell(cell);
        if (mode === 'instant' && next.end != null) commitRange(next);
        return;
      }

      setSelected(cell.date);
      moveCursorToCell(cell);
      if (mode === 'instant') commitDate(cell.date);
    },
    [
      isDayDisabled,
      selectionMode,
      selected,
      moveCursorToCell,
      mode,
      commitDate,
      commitRange,
    ],
  );

  const hoverDay = useCallback(
    (date: JalaliDate | null) => {
      if (selectionMode !== 'range') return;
      setHoverDate(date);
    },
    [selectionMode],
  );

  const selectMonth = useCallback((month: number) => {
    setCursor((current) => ({ ...current, month }));
    setView('day');
  }, []);

  const selectYear = useCallback((year: number) => {
    setCursor((current) => ({ ...current, year }));
    setView('month');
  }, []);

  const goToToday = useCallback(() => {
    const today = todayJalali();
    setCursor({ year: today.year, month: today.month });
    setView('day');
    // In single mode the shortcut also selects today; in range mode it only
    // navigates (selecting an endpoint there would be ambiguous).
    if (selectionMode === 'single' && !isDayDisabled(today)) {
      setSelected(today);
      if (mode === 'instant') commitDate(today);
    }
  }, [selectionMode, isDayDisabled, mode, commitDate]);

  const step = useCallback(
    (direction: 1 | -1) => {
      setCursor((current) => {
        if (view === 'day')
          return addMonths(current.year, current.month, direction);
        if (view === 'month')
          return { ...current, year: current.year + direction };
        return { ...current, year: current.year + direction * YEARS_PER_PAGE };
      });
    },
    [view],
  );

  const goPrev = useCallback(() => step(-1), [step]);
  const goNext = useCallback(() => step(1), [step]);

  const { canGoPrev, canGoNext } = useMemo(() => {
    if (view === 'day') {
      const prev = addMonths(cursor.year, cursor.month, -1);
      const next = addMonths(cursor.year, cursor.month, 1);
      return {
        canGoPrev:
          !minDate ||
          compareJalali(
            { ...prev, day: daysInMonth(prev.year, prev.month) },
            minDate,
          ) >= 0,
        canGoNext: !maxDate || compareJalali({ ...next, day: 1 }, maxDate) <= 0,
      };
    }
    const span = view === 'year' ? YEARS_PER_PAGE : 1;
    const lowEdge = view === 'year' ? pageStartFor(cursor.year) : cursor.year;
    return {
      canGoPrev: !minDate || lowEdge - 1 >= minDate.year,
      canGoNext: !maxDate || lowEdge + span <= maxDate.year,
    };
  }, [view, cursor.year, cursor.month, minDate, maxDate]);

  const selectedDates = selectionDates(selected);

  const monthOptions = useMemo<MonthOption[]>(() => {
    const today = todayJalali();
    return JALALI_MONTHS.map((label, index) => {
      const month = index + 1;
      const lastDay = daysInMonth(cursor.year, month);
      const before =
        minDate &&
        compareJalali({ year: cursor.year, month, day: lastDay }, minDate) < 0;
      const after =
        maxDate &&
        compareJalali({ year: cursor.year, month, day: 1 }, maxDate) > 0;
      return {
        month,
        label,
        isSelected: selectedDates.some(
          (d) => d.year === cursor.year && d.month === month,
        ),
        isCurrent: today.year === cursor.year && today.month === month,
        isDisabled: Boolean(before || after),
      };
    });
  }, [cursor.year, selectedDates, minDate, maxDate]);

  const yearOptions = useMemo<YearOption[]>(() => {
    const today = todayJalali();
    const start = pageStartFor(cursor.year);
    return Array.from({ length: YEARS_PER_PAGE }, (_, index) => {
      const year = start + index;
      return {
        year,
        label: toPersianDigits(year),
        isSelected: selectedDates.some((d) => d.year === year),
        isCurrent: today.year === year,
        isDisabled: Boolean(
          (minDate && year < minDate.year) || (maxDate && year > maxDate.year),
        ),
      };
    });
  }, [cursor.year, selectedDates, minDate, maxDate]);

  const headerLabel = useMemo(() => {
    if (view === 'year') {
      const start = pageStartFor(cursor.year);
      return `${toPersianDigits(start)} – ${toPersianDigits(start + YEARS_PER_PAGE - 1)}`;
    }
    if (view === 'month') return toPersianDigits(cursor.year);
    return `${JALALI_MONTHS[cursor.month - 1]} ${toPersianDigits(cursor.year)}`;
  }, [view, cursor.year, cursor.month]);

  const confirm = useCallback((): JalaliSelection => {
    let result = selected;
    // A range with only a start commits as a single-day range.
    if (selectionMode === 'range' && isRange(result) && result.end == null) {
      result = { start: result.start, end: result.start };
      setSelected(result);
    }
    if (result) {
      if (selectionMode === 'range' && isRange(result)) {
        commitRange(result);
      } else if (!isRange(result)) {
        commitDate(result);
      }
    }
    return result;
  }, [selected, selectionMode, commitDate, commitRange]);

  const reset = useCallback(() => {
    setSelected(committedValue);
    setHoverDate(null);
    const anchor = selectionDates(committedValue)[0] ?? todayJalali();
    setCursor({ year: anchor.year, month: anchor.month });
    setView('day');
  }, [committedValue]);

  return {
    view,
    setView,
    cursor,
    headerLabel,
    weekdayLabels: PERSIAN_WEEKDAYS_SHORT,
    weeks,
    monthOptions,
    yearOptions,
    goPrev,
    goNext,
    goToToday,
    canGoPrev,
    canGoNext,
    selectionMode,
    selected,
    selectDay,
    selectMonth,
    selectYear,
    hoverDay,
    isConfirmMode: mode === 'confirm',
    confirm,
    reset,
  };
}
