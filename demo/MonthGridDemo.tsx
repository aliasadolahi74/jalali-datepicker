import { useState } from 'react';
import {
  JalaliMonthGrid,
  IRAN_HOLIDAYS,
  toJalali,
  toPersianDigits,
  JALALI_MONTHS,
  type DayClickInfo,
  type DayEvent,
  type HolidayConfig,
} from '../src';
import { Field, Panel, SegmentedControl, Toggle } from './ui';

type Weeks = 'fixed' | 'auto';

/** A market closure expressed as one range rule, plus the usual Iranian days off. */
const HOLIDAYS: HolidayConfig = {
  ...IRAN_HOLIDAYS,
  rules: [
    ...IRAN_HOLIDAYS.rules,
    {
      type: 'range',
      start: { year: 1405, month: 6, day: 5 },
      end: { year: 1405, month: 6, day: 7 },
      label: 'تعطیلی بازار',
      category: 'closure',
    },
  ],
};

const EVENTS: DayEvent[] = [
  { id: 'a', date: { year: 1405, month: 6, day: 2 }, label: 'Settlement' },
  {
    id: 'b',
    date: { year: 1405, month: 6, day: 11 },
    label: 'Auction',
    color: '#16a34a',
  },
  {
    id: 'c',
    date: { year: 1405, month: 6, day: 11 },
    label: 'Report',
    color: '#2563eb',
  },
];

/**
 * Shahrivar 1405 is the month the `weeks` option is about: it touches only five
 * weeks, so `'auto'` drops a row that `'fixed'` keeps.
 */
export function MonthGridDemo() {
  const [weeks, setWeeks] = useState<Weeks>('auto');
  const [tintWeekends, setTintWeekends] = useState(true);
  const [interactive, setInteractive] = useState(false);
  const [fillToday, setFillToday] = useState(false);
  const [clicked, setClicked] = useState<DayClickInfo | null>(null);

  return (
    <Panel title="Read-only month grid — <JalaliMonthGrid>">
      <p
        style={{
          margin: '0 0 16px',
          fontSize: 13,
          color: 'var(--muted)',
          lineHeight: 1.7,
        }}
      >
        The picker without the chrome: weekday header and day cells, no
        navigation, no drill-down, no selection. With <code>onDayClick</code>{' '}
        omitted it is fully inert — no <code>role=&quot;grid&quot;</code>, no
        tab stops, nothing for assistive tech to announce as a widget.
      </p>

      <div
        style={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: 'minmax(220px, 260px) auto',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Weeks">
            <SegmentedControl
              value={weeks}
              onChange={setWeeks}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'fixed', label: 'Fixed' },
              ]}
            />
          </Field>
          <Toggle
            label="Tint weekends"
            checked={tintWeekends}
            onChange={setTintWeekends}
          />
          <Toggle
            label="Clickable (onDayClick)"
            checked={interactive}
            onChange={setInteractive}
          />
          <Toggle
            label="Fill today (--jdp-today-bg)"
            checked={fillToday}
            onChange={setFillToday}
          />
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--muted)' }}>
            {clicked
              ? `${toJalali(clicked.date, 'D MMMM YYYY')}${
                  clicked.holidayCategories.length
                    ? ` — ${clicked.holidayCategories.join(', ')}`
                    : ''
                }`
              : interactive
                ? 'Click a day.'
                : 'Inert — clicks do nothing.'}
          </p>
        </div>

        <div
          style={{
            width: 300,
            padding: 16,
            borderRadius: 16,
            border: '1px solid var(--line)',
            background: '#fff',
            ...(fillToday
              ? ({ '--jdp-today-bg': '#fdf3d6' } as React.CSSProperties)
              : {}),
          }}
        >
          <div
            style={{
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            {JALALI_MONTHS[5]} {toPersianDigits(1405)}
          </div>
          <JalaliMonthGrid
            year={1405}
            month={6}
            weeks={weeks}
            holidays={HOLIDAYS}
            events={EVENTS}
            tintWeekends={tintWeekends}
            onDayClick={interactive ? setClicked : undefined}
          />
        </div>
      </div>
    </Panel>
  );
}
