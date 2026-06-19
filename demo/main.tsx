import { StrictMode, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { JalaliDatePicker } from '../src';
import '../src/components/JalaliDatePicker.module.css';

// Gold theme (the look used in the Mehrshad gold app).
const gold: CSSProperties = {
  ['--jdp-font' as string]: "'Vazirmatn', sans-serif",
  ['--jdp-primary' as string]: '#e4ae21',
  ['--jdp-primary-fg' as string]: '#1c1917',
  ['--jdp-selected-bg' as string]: '#e4ae21',
  ['--jdp-selected-fg' as string]: '#1c1917',
  ['--jdp-range-bg' as string]: '#fbf3dc',
  ['--jdp-today-ring' as string]: '#e4ae21',
  ['--jdp-focus-ring' as string]: '#e4ae21',
};

// Dark theme.
const dark: CSSProperties = {
  ['--jdp-font' as string]: "'Vazirmatn', sans-serif",
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
};

function Card({
  id,
  style,
  children,
}: {
  id: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div id={id} style={style} data-shot>
      {children}
    </div>
  );
}

function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 48,
        padding: 64,
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: '#f5f5f4',
        minHeight: '100vh',
      }}
    >
      <Card id="shot-gold-single" style={gold}>
        <JalaliDatePicker
          selectionMode="single"
          defaultValue={{ year: 1404, month: 1, day: 13 }}
        />
      </Card>

      <Card id="shot-gold-range" style={gold}>
        <JalaliDatePicker
          selectionMode="range"
          defaultValue={{
            start: { year: 1404, month: 1, day: 10 },
            end: { year: 1404, month: 1, day: 22 },
          }}
        />
      </Card>

      <Card id="shot-dark" style={dark}>
        <JalaliDatePicker
          selectionMode="single"
          defaultValue={{ year: 1404, month: 1, day: 13 }}
        />
      </Card>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
