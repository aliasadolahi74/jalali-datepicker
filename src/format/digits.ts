const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Replace Latin digits (0–9) in a string/number with Persian digits (۰–۹). */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(
    /[0-9]/g,
    (digit) => PERSIAN_DIGITS[Number(digit)]
  );
}

/**
 * Fold Persian (۰–۹) and Arabic-Indic (٠–٩) digits back to Latin (0–9), leaving
 * every other character untouched. Kept local to the feature so it carries no
 * dependency on the host app's shared utilities.
 */
export function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}
