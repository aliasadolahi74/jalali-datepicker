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

## Install

```bash
npm install jalali-datepicker dayjs jalaliday
# or
yarn add jalali-datepicker dayjs jalaliday
```

`react` (>=18) is a peer dependency. `dayjs` and `jalaliday` are runtime
dependencies and will be installed automatically; they are listed above only so
you can pin them yourself if you wish.

## Usage

```tsx
import { useState } from 'react';
import { JalaliDatePicker, toGregorian, type JalaliDate } from 'jalali-datepicker';
import 'jalali-datepicker/styles.css'; // import once, anywhere

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

> **Don't forget `import 'jalali-datepicker/styles.css'`** once in your app — the
> component ships its styles as a separate stylesheet.

`JalaliDate` is `{ year, month /* 1-based */, day }` — the only date shape the API
exposes (dayjs never leaks out). Convert a selection at the end:

```ts
import { toTimestamp, toGregorian, toJalali } from 'jalali-datepicker';

toTimestamp(value);                  // epoch ms (local midnight)
toGregorian(value, 'YYYY-MM-DD');    // "2025-04-21"
toJalali(value, 'dddd D MMMM YYYY'); // "دوشنبه ۱ اردیبهشت ۱۴۰۴"
```

### Range selection

```tsx
import { JalaliDatePicker, type JalaliRange } from 'jalali-datepicker';

<JalaliDatePicker
  selectionMode="range"
  value={range}            // { start, end } | null
  onConfirm={setRange}
/>;
```

### Headless hook

```ts
import { useJalaliCalendar } from 'jalali-datepicker';

const cal = useJalaliCalendar({ value, onChange, mode: 'instant' });
// cal.weeks, cal.monthOptions, cal.yearOptions, cal.goPrev/goNext, cal.selectDay, ...
```

### Key props

| prop                     | default        | meaning                                              |
| ------------------------ | -------------- | ---------------------------------------------------- |
| `value` / `defaultValue` | –              | controlled / uncontrolled selection                  |
| `onChange`               | –              | fires when a value is committed                      |
| `onConfirm` / `onCancel` | –              | footer تأیید / لغو                                   |
| `selectionMode`          | `'single'`     | `'single'` or `'range'`                              |
| `mode`                   | `'confirm'`    | `'instant'` commits on click; `'confirm'` stages it  |
| `minDate` / `maxDate`    | –              | inclusive bounds                                     |
| `disabledDate(date)`     | –              | disable arbitrary days                               |
| `holidays`               | `IRAN_HOLIDAYS`| weekend + holiday config (see below)                 |
| `showFooter` / `showToday` | `true`       | footer + امروز shortcut                              |

## Injecting days off / holidays

```ts
import { IRAN_HOLIDAYS, type HolidayConfig } from 'jalali-datepicker';

const holidays: HolidayConfig = {
  weekends: [6], // Persian weekday index: 0 = Saturday … 6 = Friday
  rules: [
    { type: 'recurring', month: 1, day: 1, label: 'نوروز' },                 // every year
    { type: 'specific', year: 1405, month: 1, day: 13, label: 'عید فطر' },   // one-off (lunar)
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
