import { useMemo, useState } from 'react';
import {
  JalaliDatePicker,
  IRAN_HOLIDAYS,
  toJalali,
  toGregorian,
  toTimestamp,
  type JalaliDate,
  type JalaliRange,
} from '../src';
import { themes, themeOptions, type ThemeKey } from './theme';
import { Field, OutputRow, Panel, SegmentedControl, Toggle } from './ui';

type SelectionMode = 'single' | 'range';
type CommitMode = 'confirm' | 'instant';

/** Build the live output rows for the current selection. */
function describe(
  selectionMode: SelectionMode,
  single: JalaliDate | null,
  range: JalaliRange | null,
): { label: string; value: string }[] | null {
  if (selectionMode === 'single') {
    if (!single) return null;
    return [
      { label: 'شمسی', value: toJalali(single, 'dddd D MMMM YYYY') },
      { label: 'میلادی', value: toGregorian(single) },
      { label: 'Timestamp', value: String(toTimestamp(single)) },
    ];
  }

  if (!range?.start) return null;
  const rows = [{ label: 'از', value: toJalali(range.start, 'D MMMM YYYY') }];
  if (range.end) {
    rows.push({ label: 'تا', value: toJalali(range.end, 'D MMMM YYYY') });
    rows.push({
      label: 'میلادی',
      value: `${toGregorian(range.start)} → ${toGregorian(range.end)}`,
    });
  }
  return rows;
}

/** The interactive demo: controls on one side, picker in the middle, output on the other. */
export function Playground() {
  const [theme, setTheme] = useState<ThemeKey>('gold');
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('single');
  const [mode, setMode] = useState<CommitMode>('confirm');
  const [showFooter, setShowFooter] = useState(true);
  const [withHolidays, setWithHolidays] = useState(true);

  const [single, setSingle] = useState<JalaliDate | null>({
    year: 1404,
    month: 1,
    day: 13,
  });
  const [range, setRange] = useState<JalaliRange | null>({
    start: { year: 1404, month: 1, day: 10 },
    end: { year: 1404, month: 1, day: 22 },
  });

  // Re-mount the picker when structural props change so `defaultValue`/`mode`
  // are re-read cleanly.
  const pickerKey = `${selectionMode}-${mode}-${showFooter}-${withHolidays}`;
  const holidays = withHolidays ? IRAN_HOLIDAYS : undefined;

  const output = useMemo(
    () => describe(selectionMode, single, range),
    [selectionMode, single, range],
  );

  return (
    <div
      style={{
        display: 'grid',
        gap: 24,
        gridTemplateColumns: 'minmax(260px, 320px) auto minmax(260px, 320px)',
        alignItems: 'start',
        justifyContent: 'center',
      }}
    >
      <Panel title="تنظیمات">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Field label="حالت انتخاب">
            <SegmentedControl
              value={selectionMode}
              onChange={setSelectionMode}
              options={[
                { value: 'single', label: 'تکی' },
                { value: 'range', label: 'بازه‌ای' },
              ]}
            />
          </Field>
          <Field label="نحوهٔ ثبت">
            <SegmentedControl
              value={mode}
              onChange={setMode}
              options={[
                { value: 'confirm', label: 'با تأیید' },
                { value: 'instant', label: 'آنی' },
              ]}
            />
          </Field>
          <Field label="تم">
            <SegmentedControl
              value={theme}
              onChange={setTheme}
              options={themeOptions}
            />
          </Field>
          <Toggle
            label="نمایش فوتر"
            checked={showFooter}
            onChange={setShowFooter}
          />
          <Toggle
            label="تعطیلات رسمی ایران"
            checked={withHolidays}
            onChange={setWithHolidays}
          />
        </div>
      </Panel>

      <div
        style={{
          ...themes[theme].vars,
          display: 'flex',
          justifyContent: 'center',
          padding: theme === 'dark' ? 16 : 0,
          background: theme === 'dark' ? '#0c0a09' : 'transparent',
          borderRadius: 20,
        }}
      >
        {selectionMode === 'single' ? (
          <JalaliDatePicker
            key={pickerKey}
            selectionMode="single"
            mode={mode}
            showFooter={showFooter}
            holidays={holidays}
            defaultValue={single}
            onChange={setSingle}
            onConfirm={(v) => v && setSingle(v)}
          />
        ) : (
          <JalaliDatePicker
            key={pickerKey}
            selectionMode="range"
            mode={mode}
            showFooter={showFooter}
            holidays={holidays}
            defaultValue={range}
            onChange={setRange}
            onConfirm={(v) => v && setRange(v)}
          />
        )}
      </div>

      <Panel title="خروجی">
        {output ? (
          <div>
            {output.map((row) => (
              <OutputRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
            تاریخی انتخاب نشده است.
          </p>
        )}
        <p
          style={{
            margin: '18px 0 0',
            fontSize: 12.5,
            color: 'var(--muted)',
            lineHeight: 1.9,
          }}
        >
          همین مقدار را با توابع <code style={{ fontSize: 12 }}>toJalali</code>،{' '}
          <code style={{ fontSize: 12 }}>toGregorian</code> و{' '}
          <code style={{ fontSize: 12 }}>toTimestamp</code> می‌گیرید.
        </p>
      </Panel>
    </div>
  );
}
