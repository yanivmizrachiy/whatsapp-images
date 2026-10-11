import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const SSOT = 'SOURCE_OF_TRUTH.md';
const fail = (msg) => { throw new Error(`SSOT QA failed: ${msg}`); };

const ssotPath = path.join(root, SSOT);
if (!fs.existsSync(ssotPath)) fail(`${SSOT} is missing`);
const ssot = fs.readFileSync(ssotPath, 'utf8');
if (!ssot.startsWith('# מקור האמת היחיד — חרוט חדש')) fail('canonical SSOT title is missing or wrong');
// Check the current canonical meaning rather than pinning QA to one stale sentence.
const declaresOnlyAuthority =
  ssot.includes('קובץ זה בלבד מגדיר את דרישות הפרויקט') &&
  ssot.includes('`SOURCE_OF_TRUTH.md` הוא מקור האמת היחיד והמחייב');
if (!declaresOnlyAuthority) fail('SSOT does not declare itself as the only requirements authority');
if (!ssot.includes('אסור להחזיק מסמך דרישות מקביל')) fail('SSOT must explicitly forbid a parallel requirements document');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (['.git','node_modules','exports'].includes(entry.name)) return [];
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

for (const file of walk(root).filter((p) => /\.md$/i.test(p))) {
  const rel = path.relative(root, file).replaceAll('\\','/');
  if (rel === SSOT) continue;
  const text = fs.readFileSync(file, 'utf8');
  if (/^#\s+מקור האמת היחיד\b/m.test(text)) fail(`${rel} declares a competing source of truth`);
  if (/זהו קובץ ההוראות והדרישות המחייב היחיד/.test(text)) fail(`${rel} declares competing requirements authority`);
  if (/\bSSOT:ONLY-AUTHORITY\b/.test(text)) fail(`${rel} contains the authority marker reserved for ${SSOT}`);
  // Every other document must say up front that it defers to the SSOT (§1.5).
  if (!text.split(/\r?\n/).slice(0, 12).join('\n').includes(SSOT)) fail(`${rel} must point to ${SSOT} as the only requirements source in its opening lines`);
  // A derived document must not carry its own definition of done or requirements list (§1.5, §25).
  if (/^#{1,6}\s*(מה נחשב 100%|תנאי סיום|דרישות מחייבות)/m.test(text)) fail(`${rel} defines its own completion criteria/requirements; only ${SSOT} may`);
}

console.log('SSOT QA: PASS — SOURCE_OF_TRUTH.md is the single requirements authority for חרוט חדש');
