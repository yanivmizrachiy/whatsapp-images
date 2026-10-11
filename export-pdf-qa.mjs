// Prevent publishing an out-of-date downloadable PDF when the workbook gains a cover.
// Deliberately check the committed download, not only qa-artifacts from a fresh render.
import fs from 'node:fs';
import { PDFDocument } from 'pdf-lib';
const manifest = JSON.parse(fs.readFileSync('student-pages.manifest.json','utf8'));
const path = manifest.pdf.path;
if (!fs.existsSync(path)) throw new Error('Download PDF missing: '+path);
const pdf = await PDFDocument.load(fs.readFileSync(path));
const actual = pdf.getPageCount();
const expected = manifest.pdf.sheets;
if (actual !== expected) throw new Error('Stale downloadable PDF: '+actual+' sheets, expected '+expected+' (cover + '+manifest.pageCount+' pages). Regenerate and commit '+path+' before merge.');
if (!manifest.coverSheet || manifest.coverSheet.beforePage !== 1) throw new Error('Missing canonical cover contract');
console.log('Committed downloadable PDF sheet count OK:',actual);
