<p align="center">
  <img src="https://raw.githubusercontent.com/aliasadolahi74/jalali-datepicker/main/media/cover.png" alt="jalali-datepicker — RTL-first Persian date picker for React" width="100%" />
</p>

# jalali-datepicker

A self-contained, **RTL-first Persian (Jalali / Khorshidi) date picker** for React.

- 📅 **Single & range** selection
- 🎯 **Headless hook** (`useJalaliCalendar`) — build your own UI, or use the styled `<JalaliDatePicker />`
- 🏖️ **Injectable holidays / days-off** (ships a default Iran config)
- 🎨 Themeable purely through **CSS variables** — no Tailwind, no design-system coupling
- ⌨️ Keyboard navigation, header drill-down (day → month → year), an "امروز" shortcut
- 🧮 Correct leap years & month lengths via the dayjs Jalali engine
- 📦 ESM + CJS, full TypeScript types, tiny public API surface

The engine is **dayjs + [`jalaliday`](https://www.npmjs.com/package/jalaliday)** (both MIT).

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
npm install @aliasadollahi/jalali-datepicker dayjs jalaliday
# or
yarn add @aliasadollahi/jalali-datepicker dayjs jalaliday
```

`react` (>=18) is a peer dependency. `dayjs` and `jalaliday` are runtime
dependencies and will be installed automatically; they are listed above only so
you can pin them yourself if you wish.

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
| `showFooter` / `showToday` | `true`          | footer + امروز shortcut                             |

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
  ],
};
```

Fixed solar holidays are `recurring`; lunar (Hijri) holidays shift each year and
should be injected as `specific` per-year entries.

## Theming (CSS variables)

Override any of these custom properties on an ancestor to retheme — they cascade in:

```
--jdp-bg            --jdp-fg            --jdp-muted-fg      --jdp-disabled-fg
--jdp-border        --jdp-hover-bg      --jdp-selected-bg   --jdp-selected-fg
--jdp-off-fg        --jdp-today-ring    --jdp-primary       --jdp-primary-fg
--jdp-focus-ring    --jdp-radius        --jdp-control-radius --jdp-cell-radius
--jdp-shadow        --jdp-width         --jdp-font
```

## License

[MIT](./LICENSE) © Ali Asadollahi
