import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Anything that should NOT be bundled into the package output. React is a peer
// dependency; dayjs/jalaliday are runtime deps the consumer installs. Subpath
// imports (dayjs/locale/fa, jalaliday/dayjs, react/jsx-runtime) are matched too.
const external = [
  'react',
  'react-dom',
  /^react\//,
  'dayjs',
  /^dayjs\//,
  'jalaliday',
  /^jalaliday\//,
];

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the original sources readable in the published bundle.
    minify: false,
    sourcemap: true,
    // Emit one stylesheet (consumers import 'jalali-datepicker/styles.css').
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
      // -> dist/jalali-datepicker.css
      cssFileName: 'jalali-datepicker',
    },
    rollupOptions: {
      external,
    },
  },
});
