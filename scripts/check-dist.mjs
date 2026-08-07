/**
 * Load the built bundles the way a consumer would — plain Node, no bundler.
 *
 * The demo and every downstream app go through a bundler, which is far more
 * forgiving than Node's own resolver: it will happily resolve an extensionless
 * `dayjs/locale/fa` and paper over an ESM-only dependency being `require`d.
 * Node does neither, so packaging breakage of that kind ships silently unless
 * something actually loads `dist/` outside a bundler. That is this script.
 */
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const DATE = { year: 1404, month: 1, day: 13 };
const EXPECTED = '۱۳ فروردین ۱۴۰۴';

const failures = [];

function check(label, fn) {
  try {
    const got = fn();
    if (got !== EXPECTED) {
      failures.push(
        `${label}: got ${JSON.stringify(got)}, want ${JSON.stringify(EXPECTED)}`,
      );
    } else {
      console.log(`  ok  ${label}`);
    }
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
  }
}

const esm = await import(resolve(here, '../dist/index.js'));
check('esm  dist/index.js', () => esm.toJalali(DATE, 'D MMMM YYYY'));

const cjs = require(resolve(here, '../dist/index.cjs'));
check('cjs  dist/index.cjs', () => cjs.toJalali(DATE, 'D MMMM YYYY'));

if (failures.length) {
  console.error('\ndist failed to load as a plain Node package:');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log('\ndist loads cleanly in both ESM and CJS.');
