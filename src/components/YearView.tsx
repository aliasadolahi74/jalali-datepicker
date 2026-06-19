'use client';

import type { YearOption } from '../react/useJalaliCalendar';
import { cn } from '../utils/cn';
import styles from './JalaliDatePicker.module.css';

interface YearViewProps {
  options: YearOption[];
  onSelect: (year: number) => void;
}

export function YearView({ options, onSelect }: YearViewProps) {
  return (
    <div className={styles.options} role="grid" aria-label="انتخاب سال">
      {options.map((option) => (
        <button
          key={option.year}
          type="button"
          role="gridcell"
          disabled={option.isDisabled}
          aria-selected={option.isSelected}
          aria-current={option.isCurrent ? 'date' : undefined}
          onClick={() => onSelect(option.year)}
          className={cn(
            styles.option,
            option.isCurrent && styles.optionCurrent,
            option.isSelected && styles.optionSelected
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
