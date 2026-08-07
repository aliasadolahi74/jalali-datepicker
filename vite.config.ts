import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Anything that should NOT be bundled into the package output. React is a peer
// dependency; dayjs is a runtime dep the consumer installs. Subpath imports
// (dayjs/locale/fa.js, react/jsx-runtime) are matched too.
//
// `jalaliday` is deliberately NOT external: it is ESM-only (its exports map
// points at .mjs with no `require` condition), so leaving it external produces a
// `require('jalaliday/dayjs')` in the CJS build that either throws ERR_REQUIRE_ESM
// on older Node or — on Node >=22.12, where require(esm) works — hands
// `dayjs.extend` a module namespace instead of the plugin function
// ("TypeError: t is not a function"). Inlining it (~3 kB, MIT) makes the CJS
// output actually loadable.
const external = ['react', 'react-dom', /^react\//, 'dayjs', /^dayjs\//];

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
