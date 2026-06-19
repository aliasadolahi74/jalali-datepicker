'use client';

import type { MonthOption } from '../react/useJalaliCalendar';
import { cn } from '../utils/cn';
import styles from './JalaliDatePicker.module.css';

interface MonthViewProps {
  options: MonthOption[];
  onSelect: (month: number) => void;
}

export function MonthView({ options, onSelect }: MonthViewProps) {
  return (
    <div className={styles.options} role="grid" aria-label="انتخاب ماه">
      {options.map((option) => (
        <button
          key={option.month}
          type="button"
          role="gridcell"
          disabled={option.isDisabled}
          aria-selected={option.isSelected}
          aria-current={option.isCurrent ? 'date' : undefined}
          onClick={() => onSelect(option.month)}
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
