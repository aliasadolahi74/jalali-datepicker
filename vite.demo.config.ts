import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Build config for the showcase site (the `demo/` app), kept separate from the
 * library build in `vite.config.ts`. This bundles the demo into a static site
 * for GitHub Pages.
 *
 * `base` must match the GitHub Pages sub-path, i.e. the repository name, so that
 * the emitted asset URLs resolve under `https://<user>.github.io/<repo>/`. It is
 * overridable via the `DEMO_BASE` env var (handy for user/org pages served at
 * the domain root, where `DEMO_BASE=/` is correct).
 */
export default defineConfig({
  base: process.env.DEMO_BASE ?? '/jalali-datepicker/',
  root: 'demo',
  plugins: [react()],
  build: {
    // Emit outside `demo/` so it never collides with the dev sources.
    outDir: '../dist-demo',
    emptyOutDir: true,
  },
});
