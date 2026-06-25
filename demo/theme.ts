import type { CSSProperties } from 'react';

/**
 * Theme presets for the showcase. Each theme is just a bag of CSS variables the
 * picker reads — the same mechanism a consumer uses to theme it in their app.
 */

export type ThemeKey = 'light' | 'gold' | 'dark';

export interface Theme {
  label: string;
  vars: CSSProperties;
}

const FONT = "'Vazirmatn', sans-serif";

export const themes: Record<ThemeKey, Theme> = {
  light: {
    label: 'روشن',
    vars: {
      ['--jdp-font' as string]: FONT,
    },
  },
  gold: {
    label: 'طلایی',
    vars: {
      ['--jdp-font' as string]: FONT,
      ['--jdp-primary' as string]: '#e4ae21',
      ['--jdp-primary-fg' as string]: '#1c1917',
      ['--jdp-selected-bg' as string]: '#e4ae21',
      ['--jdp-selected-fg' as string]: '#1c1917',
      ['--jdp-range-bg' as string]: '#fbf3dc',
      ['--jdp-today-ring' as string]: '#e4ae21',
      ['--jdp-focus-ring' as string]: '#e4ae21',
    },
  },
  dark: {
    label: 'تیره',
    vars: {
      ['--jdp-font' as string]: FONT,
      ['--jdp-bg' as string]: '#1c1917',
      ['--jdp-fg' as string]: '#fafaf9',
      ['--jdp-muted-fg' as string]: '#a8a29e',
      ['--jdp-disabled-fg' as string]: '#57534e',
      ['--jdp-border' as string]: '#3f3b38',
      ['--jdp-hover-bg' as string]: '#292524',
      ['--jdp-primary' as string]: '#e4ae21',
      ['--jdp-primary-fg' as string]: '#1c1917',
      ['--jdp-selected-bg' as string]: '#e4ae21',
      ['--jdp-selected-fg' as string]: '#1c1917',
      ['--jdp-range-bg' as string]: '#37301c',
      ['--jdp-today-ring' as string]: '#e4ae21',
      ['--jdp-focus-ring' as string]: '#e4ae21',
    },
  },
};

export const themeOptions = (Object.keys(themes) as ThemeKey[]).map(
  (value) => ({
    value,
    label: themes[value].label,
  }),
);
