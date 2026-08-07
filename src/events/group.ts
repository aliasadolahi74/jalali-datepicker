import { dayKey } from '../core/calendar';
import type { DayEvent } from './types';

/**
 * Index events by {@link dayKey} so a grid can look up a day's events in O(1)
 * instead of scanning the whole list 42 times. Insertion order is preserved
 * within each day, which is the order the badges render in.
 */
export function groupEventsByDay(
  events: readonly DayEvent[],
): Map<string, DayEvent[]> {
  const byDay = new Map<string, DayEvent[]>();
  for (const event of events) {
    const key = dayKey(event.date);
    const bucket = byDay.get(key);
    if (bucket) bucket.push(event);
    else byDay.set(key, [event]);
  }
  return byDay;
}
