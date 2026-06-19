import type { HolidayConfig } from './types';

/**
 * Default Iranian "days off" configuration — the example you can copy, edit, or
 * replace via the picker's `holidays` prop.
 *
 * Only the **fixed solar (Jalali) national holidays** are listed as `recurring`
 * rules, because those land on the same Jalali month/day every year. Iran's
 * **lunar (Hijri) religious holidays** (e.g. Eid al-Fitr, Tasua/Ashura, ...)
 * drift by ~11 days each solar year and cannot be expressed as a recurring
 * Jalali rule. Inject them per year as `specific` rules, for example:
 *
 * ```ts
 * import { IRAN_HOLIDAYS } from '@aliasadollahi/jalali-datepicker';
 *
 * const holidays = {
 *   ...IRAN_HOLIDAYS,
 *   rules: [
 *     ...IRAN_HOLIDAYS.rules,
 *     { type: 'specific', year: 1405, month: 1, day: 13, label: 'عید فطر' },
 *   ],
 * };
 * ```
 */
export const IRAN_HOLIDAYS: HolidayConfig = {
  // Friday is the Iranian weekly day off.
  weekends: [6],
  rules: [
    { type: 'recurring', month: 1, day: 1, label: 'جشن نوروز / آغاز سال نو' },
    { type: 'recurring', month: 1, day: 2, label: 'عید نوروز' },
    { type: 'recurring', month: 1, day: 3, label: 'عید نوروز' },
    { type: 'recurring', month: 1, day: 4, label: 'عید نوروز' },
    { type: 'recurring', month: 1, day: 12, label: 'روز جمهوری اسلامی ایران' },
    { type: 'recurring', month: 1, day: 13, label: 'روز طبیعت (سیزده‌بدر)' },
    { type: 'recurring', month: 3, day: 14, label: 'رحلت حضرت امام خمینی' },
    { type: 'recurring', month: 3, day: 15, label: 'قیام ۱۵ خرداد' },
    { type: 'recurring', month: 11, day: 22, label: 'پیروزی انقلاب اسلامی' },
    { type: 'recurring', month: 12, day: 29, label: 'روز ملی شدن صنعت نفت' },
  ],
};
