import { describe, expect, it } from 'vitest';

import { resolveDayMeta } from './resolve';
import type { HolidayConfig } from './types';
import { WEEKDAY } from '../core/constants';

const config: HolidayConfig = {
  weekends: [WEEKDAY.FRIDAY],
  rules: [
    {
      type: 'range',
      start: { year: 1404, month: 1, day: 10 },
      end: { year: 1404, month: 1, day: 12 },
      label: 'Closure',
      category: 'closure',
    },
    {
      type: 'recurring',
      month: 1,
      day: 1,
      label: 'Nowruz',
      category: 'public',
    },
    {
      type: 'specific',
      year: 1404,
      month: 1,
      day: 11,
      label: 'Audit',
      category: 'internal',
    },
  ],
};

const at = (day: number, weekday: number = WEEKDAY.SATURDAY) =>
  resolveDayMeta({ year: 1404, month: 1, day }, weekday, config);

describe('range rules', () => {
  it('covers both endpoints inclusively', () => {
    expect(at(10).labels).toEqual(['Closure']);
    expect(at(12).isHoliday).toBe(true);
  });

  it('excludes the days either side', () => {
    expect(at(9).isHoliday).toBe(false);
    expect(at(13).isHoliday).toBe(false);
  });

  it('stacks with other rules on the same day', () => {
    expect(at(11).labels).toEqual(['Closure', 'Audit']);
    expect(at(11).matched).toHaveLength(2);
  });
});

describe('categories', () => {
  it('reports the distinct categories that matched', () => {
    expect(at(11).categories).toEqual(['closure', 'internal']);
  });

  it('deduplicates repeated categories', () => {
    const meta = resolveDayMeta({ year: 1404, month: 1, day: 1 }, 0, {
      weekends: [],
      rules: [
        { type: 'recurring', month: 1, day: 1, label: 'A', category: 'x' },
        { type: 'recurring', month: 1, day: 1, label: 'B', category: 'x' },
      ],
    });
    expect(meta.categories).toEqual(['x']);
  });

  it('is empty when no matched rule carries one', () => {
    const meta = resolveDayMeta({ year: 1404, month: 1, day: 1 }, 0, {
      weekends: [],
      rules: [{ type: 'recurring', month: 1, day: 1, label: 'A' }],
    });
    expect(meta.categories).toEqual([]);
  });
});

describe('weekends stay factual', () => {
  it('reports isWeekend from the config, independent of holidays', () => {
    expect(at(13, WEEKDAY.FRIDAY).isWeekend).toBe(true);
    expect(at(13, WEEKDAY.FRIDAY).isHoliday).toBe(false);
    expect(at(13, WEEKDAY.FRIDAY).isOff).toBe(true);
  });

  it('recurring rules repeat across years', () => {
    const meta = resolveDayMeta({ year: 1409, month: 1, day: 1 }, 0, config);
    expect(meta.labels).toEqual(['Nowruz']);
  });
});
