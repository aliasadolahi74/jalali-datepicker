import { useMemo, useState } from 'react';
import {
  JalaliDatePicker,
  IRAN_HOLIDAYS,
  toJalali,
  toGregorian,
  toTimestamp,
  type HolidayConfig,
  type JalaliDate,
  type JalaliRange,
} from '../src';
import { themes, themeOptions, type ThemeKey } from './theme';
import { Field, OutputRow, Panel, SegmentedControl, Toggle } from './ui';

type SelectionMode = 'single' | 'range';
type CommitMode = 'confirm' | 'instant';
type HolidaySource = 'iran' | 'none' | 'custom';

/** No weekends and no holidays — what we pass to truly disable them. */
const NO_HOLIDAYS: HolidayConfig = { weekends: [], rules: [] };

/** Starting point for the custom-JSON editor. */
const SAMPLE_JSON = JSON.stringify(
  {
    weekends: [6],
    rules: [
      { type: 'recurring', month: 1, day: 1, label: 'Nowruz' },
      { type: 'recurring', month: 1, day: 13, label: 'Nature Day' },
      { type: 'specific', year: 1404, month: 7, day: 1, label: 'Team offsite' },
    ],
  },
  null,
  2,
);

/** Parse the editor text into a HolidayConfig, returning a friendly error instead of throwing. */
function parseHolidays(text: string): {
  config: HolidayConfig | null;
  error: string | null;
} {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (e) {
    return { config: null, error: (e as Error).message };
  }
  if (
    typeof value !== 'object' ||
    value === null ||
    !Array.isArray((value as HolidayConfig).weekends) ||
    !Array.isArray((value as HolidayConfig).rules)
  ) {
    return {
      config: null,
      error: 'Expected an object with "weekends" and "rules" arrays.',
    };
  }
  return { config: value as HolidayConfig, error: null };
}

/** Build the live output rows for the current selection. */
function describe(
  selectionMode: SelectionMode,
  single: JalaliDate | null,
  range: JalaliRange | null,
): { label: string; value: string }[] | null {
  if (selectionMode === 'single') {
    if (!single) return null;
    return [
      { label: 'Jalali', value: toJalali(single, 'dddd D MMMM YYYY') },
      { label: 'Gregorian', value: toGregorian(single) },
      { label: 'Timestamp', value: String(toTimestamp(single)) },
    ];
  }

  if (!range?.start) return null;
  const rows = [{ label: 'From', value: toJalali(range.start, 'D MMMM YYYY') }];
  if (range.end) {
    rows.push({ label: 'To', value: toJalali(range.end, 'D MMMM YYYY') });
    rows.push({
      label: 'Gregorian',
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
  const [holidaySource, setHolidaySource] = useState<HolidaySource>('iran');
  const [customJson, setCustomJson] = useState(SAMPLE_JSON);

  const [single, setSingle] = useState<JalaliDate | null>({
    year: 1404,
    month: 1,
    day: 13,
  });
  const [range, setRange] = useState<JalaliRange | null>({
    start: { year: 1404, month: 1, day: 10 },
    end: { year: 1404, month: 1, day: 22 },
  });

  // `defaultValue`/`mode`/footer are read at mount, so re-mount when they
  // change. Holidays are NOT keyed here — the picker reacts to that prop live,
  // so editing the JSON updates the grid without resetting the selection.
  const pickerKey = `${selectionMode}-${mode}-${showFooter}`;

  const parsed = useMemo(() => parseHolidays(customJson), [customJson]);

  const holidays =
    holidaySource === 'none'
      ? NO_HOLIDAYS
      : holidaySource === 'iran'
        ? IRAN_HOLIDAYS
        : (parsed.config ?? NO_HOLIDAYS);

  const output = useMemo(
    () => describe(selectionMode, single, range),
    [selectionMode, single, range],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: 'minmax(260px, 320px) auto minmax(260px, 320px)',
          alignItems: 'start',
          justifyContent: 'center',
        }}
      >
        <Panel title="Options">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Selection">
              <SegmentedControl
                value={selectionMode}
                onChange={setSelectionMode}
                options={[
                  { value: 'single', label: 'Single' },
                  { value: 'range', label: 'Range' },
                ]}
              />
            </Field>
            <Field label="Commit mode">
              <SegmentedControl
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'confirm', label: 'Confirm' },
                  { value: 'instant', label: 'Instant' },
                ]}
              />
            </Field>
            <Field label="Theme">
              <SegmentedControl
                value={theme}
                onChange={setTheme}
                options={themeOptions}
              />
            </Field>
            <Field label="Holidays">
              <SegmentedControl
                value={holidaySource}
                onChange={setHolidaySource}
                options={[
                  { value: 'iran', label: 'Iran' },
                  { value: 'none', label: 'None' },
                  { value: 'custom', label: 'Custom' },
                ]}
              />
            </Field>
            <Toggle
              label="Show footer"
              checked={showFooter}
              onChange={setShowFooter}
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

        <Panel title="Output">
          {output ? (
            <div>
              {output.map((row) => (
                <OutputRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
              No date selected.
            </p>
          )}
          <p
            style={{
              margin: '18px 0 0',
              fontSize: 12.5,
              color: 'var(--muted)',
              lineHeight: 1.8,
            }}
          >
            The same value is available via <code>toJalali</code>,{' '}
            <code>toGregorian</code> and <code>toTimestamp</code>.
          </p>
        </Panel>
      </div>

      {holidaySource === 'custom' && (
        <Panel title="Custom holidays (JSON)">
          <p
            style={{
              margin: '0 0 12px',
              fontSize: 13,
              color: 'var(--muted)',
              lineHeight: 1.7,
            }}
          >
            A <code>HolidayConfig</code>: <code>weekends</code> is an array of
            Persian weekday indices (0 = Saturday … 6 = Friday). Each rule is
            either <code>{'{ type: "recurring", month, day, label }'}</code> or{' '}
            <code>{'{ type: "specific", year, month, day, label }'}</code>{' '}
            (Jalali dates). Edits apply to the calendar instantly.
          </p>
          <textarea
            value={customJson}
            onChange={(e) => setCustomJson(e.target.value)}
            spellCheck={false}
            rows={12}
            style={{
              width: '100%',
              resize: 'vertical',
              fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
              fontSize: 13,
              lineHeight: 1.6,
              padding: 14,
              borderRadius: 10,
              border: `1px solid ${parsed.error ? '#dc2626' : 'var(--line)'}`,
              background: '#fafaf9',
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 12.5,
              color: parsed.error ? '#dc2626' : '#16a34a',
            }}
          >
            {parsed.error ? `⚠ ${parsed.error}` : '✓ Valid — applied above.'}
          </p>
        </Panel>
      )}
    </div>
  );
}
