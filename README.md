<p align="center">
  <img src="https://raw.githubusercontent.com/aliasadolahi74/jalali-datepicker/main/media/cover.png" alt="jalali-datepicker — RTL-first Persian date picker for React" width="100%" />
</p>

<p align="center">
  <a href="https://aliasadolahi74.github.io/jalali-datepicker/"><strong>🔗 Live demo</strong></a>
</p>

# jalali-datepicker

A self-contained, **RTL-first Persian (Jalali / Khorshidi) date picker** for React.

- 📅 **Single & range** selection
- 🗓️ **Read-only month grid** (`<JalaliMonthGrid>`) — inert by default, `renderDay` slot
- 🎯 **Headless hook** (`useJalaliCalendar`) — build your own UI, or use the styled `<JalaliDatePicker />`
- 🏖️ **Injectable holidays / days-off** — recurring, one-off, and date-**range** rules, with categories (ships a default Iran config)
- 🔤 **Jalali parsing & day math** — `parseJalali`, `addDays`, `diffDays`, `eachDayOfInterval`
- 🔵 **Per-day event badges** — stylable dots under any day, plus an `onDayClick` that hands you that day's events
- 🎨 Themeable purely through **CSS variables** — no Tailwind, no design-system coupling
- ⌨️ Keyboard navigation, header drill-down (day → month → year), an "امروز" shortcut
- 🧮 Correct leap years & month lengths via the dayjs Jalali engine
- 📦 ESM + CJS, full TypeScript types, tiny public API surface

The engine is **dayjs + [`jalaliday`](https://www.npmjs.com/package/jalaliday)** (both MIT);
`jalaliday` is bundled, so `dayjs` is the only dependency you install.

## How it compares

The Persian-React date-picker space is crowded. This library is deliberately
**narrow and self-contained** — one calendar (Jalali), no UI framework, no global
state, only `dayjs` + `jalaliday` under the hood — rather than a multi-calendar
toolkit. That focus is the trade-off to weigh below.

|                                |  **jalali-datepicker**  |      [react-multi-date-picker]       |      [zaman]       | [react-modern-calendar-datepicker] |
| ------------------------------ | :---------------------: | :----------------------------------: | :----------------: | :--------------------------------: |
| Persian (Jalali)               |           ✅            |                  ✅                  |         ✅         |                 ✅                 |
| Single / range                 |         ✅ / ✅         |         ✅ / ✅ (+ multiple)         |      ✅ / ✅       |              ✅ / ✅               |
| RTL                            |      ✅ always-on       |              via locale              |      via prop      |                 ✅                 |
| Headless hook                  | ✅ `useJalaliCalendar`  |                  ❌                  |         ❌         |                 ❌                 |
| Injectable holidays / days-off | ✅ ships an Iran config |                  ❌                  |         ❌         |                 ❌                 |
| Theming                        |    ✅ CSS variables     |             CSS classes              | `accentColor` prop |         color props / CSS          |
| No UI-framework dependency     |           ✅            |         needs popper helper          |   styled output    |             CSS bundle             |
| First-party TypeScript types   |           ✅            |                  ✅                  |         ✅         |        community (`@types`)        |
| Built-in time picker           |           ❌            |              via plugin              |         ✅         |                 ❌                 |
| Other calendars                |     ❌ Jalali-only      | ✅ Gregorian/Arabic/Indian + plugins |     Gregorian      |             Gregorian              |
| Actively maintained            |           ✅            |              ✅ (2024)               |       ~2023        |      ❌ (last release ~2019)       |

**Reach for an alternative when** you need several calendar systems or a plugin
ecosystem ([react-multi-date-picker]), or a time picker baked into the same
component ([zaman]). If you want a small, themeable, RTL-first Jalali calendar
with first-class holiday support and a headless option, this library is the tighter fit.

[react-multi-date-picker]: https://github.com/shahabyazdi/react-multi-date-picker
[zaman]: https://github.com/rzkhosroshahi/zaman
[react-modern-calendar-datepicker]: https://github.com/Kiarash-Z/react-modern-calendar-datepicker

> Comparison reflects publicly available information as of June 2026; the other
> libraries continue to evolve — double-check against their own docs.

## Install

```bash
npm install @aliasadollahi/jalali-datepicker dayjs
# or
yarn add @aliasadollahi/jalali-datepicker dayjs
```

`react` (>=18) is a peer dependency. `dayjs` is the one runtime dependency and
is installed automatically; it is listed above only so you can pin it yourself
if you wish. The Jalali plugin is bundled into the package, so there is nothing
else to install.

Both `import` and `require` work in plain Node, with no bundler required.

## Usage

```tsx
import { useState } from 'react';
import {
  JalaliDatePicker,
  toGregorian,
  type JalaliDate,
} from '@aliasadollahi/jalali-datepicker';
import '@aliasadollahi/jalali-datepicker/styles.css'; // import once, anywhere

function Example() {
  const [value, setValue] = useState<JalaliDate | null>(null);

  return (
    <JalaliDatePicker
      value={value}
      onConfirm={setValue} // confirm mode (default): commits on تأیید
      minDate={{ year: 1400, month: 1, day: 1 }}
    />
  );
}
```

> **Don't forget `import '@aliasadollahi/jalali-datepicker/styles.css'`** once in your app — the
> component ships its styles as a separate stylesheet.

`JalaliDate` is `{ year, month /* 1-based */, day }` — the only date shape the API
exposes (dayjs never leaks out). Convert a selection at the end:

```ts
import {
  toTimestamp,
  toGregorian,
  toJalali,
} from '@aliasadollahi/jalali-datepicker';

toTimestamp(value); // epoch ms (local midnight)
toGregorian(value, 'YYYY-MM-DD'); // "2025-04-21"
toJalali(value, 'dddd D MMMM YYYY'); // "دوشنبه ۱ اردیبهشت ۱۴۰۴"
```

### Range selection

```tsx
import {
  JalaliDatePicker,
  type JalaliRange,
} from '@aliasadollahi/jalali-datepicker';

<JalaliDatePicker
  selectionMode="range"
  value={range} // { start, end } | null
  onConfirm={setRange}
/>;
```

### Headless hook

```ts
import { useJalaliCalendar } from '@aliasadollahi/jalali-datepicker';

const cal = useJalaliCalendar({ value, onChange, mode: 'instant' });
// cal.weeks, cal.monthOptions, cal.yearOptions, cal.goPrev/goNext, cal.selectDay, ...
```

### Event badges

Mark days with small circles under the day number — one circle per event, so a
day with three meetings shows three dots. Events are independent of the holiday
config: a holiday says the day is _off_, an event only says something is _on_ it.

```tsx
import {
  JalaliDatePicker,
  type DayEvent,
} from '@aliasadollahi/jalali-datepicker';

// Hoist or memoize — a new array identity on every render re-enriches the grid.
const events: DayEvent[] = [
  { id: 'standup', date: { year: 1404, month: 1, day: 5 }, label: 'استندآپ' },
  {
    id: 'release',
    date: { year: 1404, month: 1, day: 18 },
    label: 'انتشار',
    color: '#16a34a', // overrides --jdp-badge-color for this badge only
  },
];

<JalaliDatePicker
  events={events}
  maxBadgesPerDay={3} // extra events still reach the tooltip
  onDayClick={(info) => {
    // info.events / info.holidayLabels / info.isOff / info.date …
    console.log(info.events.map((e) => e.label));
  }}
/>;
```

`onDayClick` fires on every (enabled) day click with that day's events and
holiday labels attached, so you can open a detail panel or fetch without keeping
your own day→data map. It is independent of selection — the committed value
still arrives through `onChange` / `onConfirm`.

Badges are decorative (`aria-hidden`); every event `label` — including truncated
ones — is folded into the cell's tooltip and accessible name.

Style them with the `--jdp-badge-*` variables below, per event via `color`, or
per event via `className` for anything else.

### Read-only month grid

`<JalaliMonthGrid>` is the picker's grid without the chrome — weekday header and
day cells, nothing else. No navigation, no month/year drill-down, no footer, no
selection. It's what you want when a month _displays_ data rather than collecting
a date:

```tsx
import { JalaliMonthGrid } from '@aliasadollahi/jalali-datepicker';

<JalaliMonthGrid
  year={1405}
  month={6} // 1-based
  weeks="auto" // only the weeks the month touches (Shahrivar 1405 = 5)
  holidays={holidays}
  events={events}
/>;
```

**It is inert by default.** With no `onDayClick` there is no `role="grid"`, no
tab stop, and no key handling — nothing for assistive tech to announce as an
interactive widget. Pass `onDayClick` and each day becomes a real button; it
still never claims to be a grid widget.

| prop                | default         | meaning                                        |
| ------------------- | --------------- | ---------------------------------------------- |
| `year` / `month`    | –               | required; `month` is 1-based                   |
| `weeks`             | `'fixed'`       | `'fixed'` = always 6 rows; `'auto'` trims      |
| `holidays`          | `IRAN_HOLIDAYS` | same config the picker takes                   |
| `events`            | –               | same badges the picker draws                   |
| `maxBadgesPerDay`   | `3`             | badges per day before truncating               |
| `tintWeekends`      | `true`          | paint weekends with `--jdp-off-fg`             |
| `today`             | ambient zone    | what counts as today; `null` marks none        |
| `showWeekdayHeader` | `true`          | render the ش…ج row                             |
| `renderDay`         | –               | `(cell, meta) => ReactNode`, replaces contents |
| `onDayClick`        | –               | omit for a fully inert calendar                |

`renderDay` receives the `BaseDayCell` and its resolved `DayMeta`, so you can put
a price, a badge, or anything else in the cell while keeping the grid's tinting
and layout:

```tsx
<JalaliMonthGrid
  year={1405}
  month={6}
  renderDay={(cell, meta) => (
    <span>
      {toPersianDigits(cell.date.day)}
      {meta.categories.includes('closure') && <em>✕</em>}
    </span>
  )}
/>
```

The grid resolves the `--jdp-*` variables itself, so it themes standalone and
does not have to be nested inside a picker. It ships bare — no card border,
padding, or shadow — so you can drop it straight into your own container.

### Deciding what "today" is

By default the today marker follows the **ambient** timezone — the browser's zone
on the client, `TZ` on a server. That is wrong in two common cases:

- **A calendar for a fixed locale, viewed from elsewhere.** A Tehran market
  calendar opened from New York highlights the wrong day for the hours after
  Tehran's midnight.
- **Server rendering.** A client component still renders to HTML in Node. If the
  server's zone differs from the browser's, the initial markup marks a different
  day than the client does after hydration — silent, and only near midnight.

Rather than teach the package about timezones, inject the date:

```tsx
import { JalaliMonthGrid, todayJalali } from '@aliasadollahi/jalali-datepicker';

// Whatever rule you want: a fixed zone, the user's profile, a pinned date.
const today = todayJalali('Asia/Tehran');

<JalaliMonthGrid year={1405} month={5} today={today} />;
<JalaliDatePicker today={today} />; // also drives where امروز jumps to
```

`today` is accepted by `<JalaliDatePicker>`, `<JalaliMonthGrid>`,
`useJalaliCalendar`, and `buildMonthGrid`. Omit it for today's behaviour; pass
`null` to mark no day at all.

`todayJalali(timeZone?)` is the convenience — with no argument it reads the
ambient zone, with an IANA name it pins one. You can compute the date any other
way you like; it is a plain `JalaliDate`.

Because it is a value rather than a policy, it is also the seam that makes this
testable without mocking the clock — the suite asserts the same marked day under
three different `TZ` settings.

### Key props

| prop                       | default         | meaning                                             |
| -------------------------- | --------------- | --------------------------------------------------- |
| `value` / `defaultValue`   | –               | controlled / uncontrolled selection                 |
| `onChange`                 | –               | fires when a value is committed                     |
| `onConfirm` / `onCancel`   | –               | footer تأیید / لغو                                  |
| `selectionMode`            | `'single'`      | `'single'` or `'range'`                             |
| `mode`                     | `'confirm'`     | `'instant'` commits on click; `'confirm'` stages it |
| `minDate` / `maxDate`      | –               | inclusive bounds                                    |
| `disabledDate(date)`       | –               | disable arbitrary days                              |
| `holidays`                 | `IRAN_HOLIDAYS` | weekend + holiday config (see below)                |
| `tintWeekends`             | `true`          | paint weekends with `--jdp-off-fg`                  |
| `today`                    | ambient zone    | what counts as today; `null` marks none             |
| `events`                   | –               | days to mark with badges (see above)                |
| `maxBadgesPerDay`          | `3`             | badges drawn per day before truncating              |
| `onDayClick(info)`         | –               | day click + that day's events / holiday labels      |
| `showFooter` / `showToday` | `true`          | footer + امروز shortcut                             |

## Calendar utilities

Everything the picker uses internally is exported, so a custom UI never has to
reimplement Jalali math:

```ts
import {
  todayJalali, // (timeZone?) → JalaliDate for today; ambient zone by default
  daysInMonth, // (year, month) → 29 | 30 | 31
  isLeapYear, // Esfand has 30 days
  persianWeekday, // (date) → 0 = Saturday … 6 = Friday
  addMonths, // (year, month, delta) → { year, month }
  addDays, // (date, delta) → JalaliDate
  diffDays, // (a, b) → whole days, b - a
  eachDayOfInterval, // (start, end) → JalaliDate[], both inclusive
  compareJalali, // (a, b) → -1 | 0 | 1
  isSameDay,
  clampToRange, // (date, min?, max?) → JalaliDate
  buildMonthGrid, // (year, month, { weeks, today }) → BaseDayCell[][]
  dayKey, // (date) → "1404-1-13" — same string as BaseDayCell.key
  WEEKDAY, // { SATURDAY: 0 … FRIDAY: 6 }
  IRAN_WEEKEND, // [6] — drop straight into HolidayConfig.weekends
  groupEventsByDay, // (events) → Map<dayKey, DayEvent[]>
  resolveDayMeta, // (date, weekday, holidays) → DayMeta
} from '@aliasadollahi/jalali-datepicker';
```

`dayKey` is the supported way to index your own per-day data — it produces
exactly the string `BaseDayCell.key` carries, so the two can never drift.

`eachDayOfInterval` returns `[]` when `end` is before `start` (an empty range,
not a reversed one), and both bounds are inclusive. All three helpers cross
month and year boundaries correctly, including Esfand's 29/30 leap-year split.

`buildMonthGrid` returns six weeks by default — a stable height, so a picker does
not jump when navigating. Pass `{ weeks: 'auto' }` to get only the weeks the
month actually touches, which is what a static calendar wants.

Weekday indices are `0 = Saturday … 6 = Friday` throughout; use `WEEKDAY` rather
than writing `const FRIDAY = 6`.

### Parsing Jalali strings

The inverse of `toJalali` — for APIs that hand you a rendered Persian date and
no ISO value alongside:

```ts
import { parseJalali, isValidJalali } from '@aliasadollahi/jalali-datepicker';

parseJalali('۵ شهریور ۱۴۰۵'); // { year: 1405, month: 6, day: 5 }
parseJalali('1404/01/13'); // { year: 1404, month: 1, day: 13 }
parseJalali('۱۴۰۵-۱۲-۳۱'); // null — Esfand 1405 has only 29 days
parseJalali('13/01/1404', 'DD/MM/YYYY'); // explicit pattern

isValidJalali({ year: 1403, month: 12, day: 30 }); // true — 1403 is a leap year
isValidJalali({ year: 1404, month: 12, day: 30 }); // false
```

It **returns `null` instead of throwing**, so you can fall back to rendering the
server's string verbatim. Persian, Arabic-Indic, and Latin digits all work, and
ZWNJ, bidi marks, and repeated spaces are tolerated. Without a pattern it tries
`'YYYY/MM/DD'`, `'YYYY-MM-DD'`, then `'D MMMM YYYY'`. Supported tokens: `YYYY`,
`YY`, `MMMM`, `MM`, `M`, `DD`, `D`.

## Injecting days off / holidays

```ts
import {
  IRAN_HOLIDAYS,
  type HolidayConfig,
} from '@aliasadollahi/jalali-datepicker';

const holidays: HolidayConfig = {
  weekends: [6], // Persian weekday index: 0 = Saturday … 6 = Friday
  rules: [
    { type: 'recurring', month: 1, day: 1, label: 'نوروز' }, // every year
    { type: 'specific', year: 1405, month: 1, day: 13, label: 'عید فطر' }, // one-off (lunar)
    {
      type: 'range', // a contiguous span, both ends inclusive
      start: { year: 1405, month: 6, day: 5 },
      end: { year: 1405, month: 6, day: 7 },
      label: 'تعطیلی بازار',
      category: 'closure',
    },
  ],
};
```

Fixed solar holidays are `recurring`; lunar (Hijri) holidays shift each year and
should be injected as `specific` per-year entries. Use `range` for a shutdown or
vacation so a two-week closure stays one rule instead of fourteen.

### Categories: styling one kind of day differently

Every rule takes an optional `category`. `resolveDayMeta` reports the distinct
categories that matched, and the picker mirrors them onto the day cell as a
`data-holiday-categories` attribute, so you can style a market closure
differently from a public holiday without a parallel lookup table:

```css
.my-picker [data-holiday-categories~='closure'] {
  text-decoration: underline dotted;
}
```

```ts
const meta = resolveDayMeta(date, weekday, holidays);
meta.categories; // ['closure']
meta.matched; // the HolidayRule objects themselves
meta.labels; // ['تعطیلی بازار']
```

### Weekends vs. tinting

`isWeekend` is **factual** — it reports what `weekends` says, always. Whether
weekends are _painted_ with `--jdp-off-fg` is a separate, styling decision:

```tsx
// Keep the package's weekend knowledge, but style Fridays yourself.
<JalaliDatePicker holidays={holidays} tintWeekends={false} />
```

Holidays stay tinted either way, so a holiday and a plain weekend become
visually distinguishable — which `isOff` alone cannot express.

## Theming (CSS variables)

Override any of these custom properties on an ancestor to retheme — they cascade in:

```
--jdp-bg            --jdp-fg            --jdp-muted-fg       --jdp-disabled-fg
--jdp-border        --jdp-hover-bg      --jdp-selected-bg    --jdp-selected-fg
--jdp-range-bg      --jdp-off-fg        --jdp-outside-off-fg --jdp-today-ring
--jdp-today-bg      --jdp-primary       --jdp-primary-fg     --jdp-focus-ring
--jdp-radius        --jdp-control-radius --jdp-cell-radius   --jdp-shadow
--jdp-width         --jdp-font
```

`--jdp-today-bg` is `transparent` by default, so today reads as a ring. Set it to
fill today instead — the ring stays, and a selected or in-range day still wins.

`--jdp-outside-off-fg` colours a day that is **both** out-of-month and a weekend.
It defaults to a muted mix of `--jdp-off-fg` toward the background, so an
out-of-month Friday reads as lighter than an in-month one instead of taking the
full off colour.

### Metrics

Colours alone cannot satisfy a design that specifies cell size or type scale, so
the sizing is themeable too. All default to the shipped values, so nothing moves
unless you set them:

```
--jdp-grid-gap          /* 2px      → gap between day cells       */
--jdp-day-font-size     /* inherit  → the day number              */
--jdp-weekday-height    /* 2rem     → weekday header row height   */
--jdp-weekday-font-size /* 0.75rem  → weekday header label        */
```

Cell size is a **consequence of the gap**, not a variable of its own: the grid is
`repeat(7, 1fr)` with a 1:1 aspect ratio, so the cell is whatever the container
leaves. At a 280px container the default `gap: 2px` gives `(280 − 6×2) / 7 =
38.3px` cells; `--jdp-grid-gap: 0` gives exactly 40px. Set the gap to hit a cell
size rather than widening the container, which would overflow whatever card the
grid sits in.

```css
/* a 40×40 grid with 16px numerals in a 280px container */
.market-calendar {
  --jdp-grid-gap: 0;
  --jdp-day-font-size: 16px;
  --jdp-weekday-height: 40px;
  --jdp-weekday-font-size: 14px;
}
```

Event badges have their own set:

```
--jdp-badge-color           /* dot fill; defaults to --jdp-primary        */
--jdp-badge-selected-color  /* dot fill on the selected day; --jdp-selected-fg */
--jdp-badge-size            /* diameter, default 4px                      */
--jdp-badge-gap             /* space between dots, default 2px            */
--jdp-badge-offset          /* distance from the bottom of the cell, 4px  */
```

## API stability

These are the guarantees a major version buys you. Changing any of them is a
breaking change:

1. **`JalaliDate` is `{ year, month, day }`**, with `month` **1-based**
   (1 = فروردین … 12 = اسفند). No dayjs instance ever crosses the API boundary.
2. **Weekday indices are 0 = Saturday … 6 = Friday** everywhere — `BaseDayCell.weekday`,
   `HolidayConfig.weekends`, and `persianWeekday()`.
3. **`BaseDayCell.key` has a stable format**, `` `${year}-${month}-${day}` ``,
   produced by the exported `dayKey()`.
4. **The `--jdp-*` custom properties are the public theming contract.** Everything
   in [Theming](#theming-css-variables) is supported; the private `--_*` variables
   and the CSS-module class names are not — do not target them.
5. **The picker root always sets `dir="rtl"`** (and `lang="fa"`), independent of the
   host document's direction.

`resolveDayMeta`, `buildMonthGrid`, and the `useJalaliCalendar` result shape are
public API too. Fields may be **added** to `DayMeta` / `BaseDayCell` /
`EnrichedDayCell` in a minor release, so read them rather than constructing them
by hand.

## License

[MIT](./LICENSE) © Ali Asadollahi
