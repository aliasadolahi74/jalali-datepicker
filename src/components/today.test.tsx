// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';

import { JalaliDatePicker } from './JalaliDatePicker';
import { JalaliMonthGrid } from './JalaliMonthGrid';
import { todayJalali } from '../core/calendar';

const TODAY = { year: 1405, month: 5, day: 17 };

/** The `data-key` of the cell carrying the today ring, or null. */
function ringedCell(html: string): string | null {
  // Class names are hashed, so match the stable prefix the CSS module keeps.
  const match = html.match(/data-key="([^"]+)"(?![^>]*disabled)[^>]*dayToday/);
  if (match) return match[1];
  // Attribute order differs between the two components; try the other way round.
  const alt = html.match(/class="[^"]*dayToday[^"]*"[^>]*data-key="([^"]+)"/);
  return alt?.[1] ?? null;
}

function todayKeysIn(container: HTMLElement): string[] {
  return [...container.querySelectorAll('[class*="dayToday"]')].map(
    (el) => (el as HTMLElement).dataset.key ?? '',
  );
}

describe('<JalaliMonthGrid today>', () => {
  it('rings the injected day', () => {
    const html = renderToStaticMarkup(
      <JalaliMonthGrid year={1405} month={5} today={TODAY} />,
    );
    expect(ringedCell(html)).toBe('1405-5-17');
  });

  it('rings nothing when today is null', () => {
    const html = renderToStaticMarkup(
      <JalaliMonthGrid year={1405} month={5} today={null} />,
    );
    expect(html).not.toMatch(/dayToday/);
  });

  it('falls back to the ambient date when omitted', () => {
    const ambient = todayJalali();
    const html = renderToStaticMarkup(
      <JalaliMonthGrid year={ambient.year} month={ambient.month} />,
    );
    expect(ringedCell(html)).toBe(
      `${ambient.year}-${ambient.month}-${ambient.day}`,
    );
  });
});

describe('<JalaliDatePicker today>', () => {
  it('rings the injected day', () => {
    const html = renderToStaticMarkup(
      <JalaliDatePicker today={TODAY} defaultValue={TODAY} />,
    );
    expect(ringedCell(html)).toBe('1405-5-17');
  });

  it('rings nothing when today is null', () => {
    const html = renderToStaticMarkup(
      <JalaliDatePicker today={null} defaultValue={TODAY} />,
    );
    expect(html).not.toMatch(/dayToday/);
  });
});

describe('the امروز shortcut', () => {
  let container: HTMLDivElement | null = null;

  afterEach(() => {
    container?.remove();
    container = null;
  });

  it('jumps to the injected date rather than the ambient one', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    // Start on a different month so the shortcut has somewhere to travel.
    await act(async () => {
      root.render(
        <JalaliDatePicker
          today={TODAY}
          defaultValue={{ year: 1404, month: 1, day: 1 }}
        />,
      );
    });
    expect(todayKeysIn(container)).toEqual([]);

    const shortcut = [...container.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'امروز',
    );
    expect(shortcut).toBeDefined();

    await act(async () => {
      shortcut!.click();
    });

    // The grid moved to Mordad 1405 and marked the injected day.
    expect(todayKeysIn(container)).toEqual(['1405-5-17']);
    expect(container.textContent).toContain('مرداد');
  });
});
