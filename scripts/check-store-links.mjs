#!/usr/bin/env node
/**
 * Release check: every store, privacy and community URL in the content must answer 200
 * from the live internet, and Play listings must still name Abrava Studio as developer.
 * Not part of CI (it depends on third-party sites); run it before each release.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gamesDir = path.join(root, 'src', 'content', 'games');
const studioFile = await readFile(path.join(root, 'src', 'data', 'studio.ts'), 'utf8');

const urls = new Set();
for (const file of await readdir(gamesDir)) {
  const yaml = await readFile(path.join(gamesDir, file), 'utf8');
  for (const [, url] of yaml.matchAll(/^\s*(?:url|privacyPolicy):\s*(https:\/\/\S+)/gm)) urls.add(url);
}
for (const [, url] of studioFile.matchAll(/'(https:\/\/[^']+)'/g)) urls.add(url);

let failed = 0;
for (const url of urls) {
  try {
    const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (abravastudio.com link check)' } });
    let note = '';
    if (url.startsWith('https://play.google.com/store/apps/details')) {
      const body = await res.text();
      note = body.includes('Abrava Studio') ? ' (developer: Abrava Studio)' : ' (WARNING: developer name not found)';
      if (!body.includes('Abrava Studio')) failed++;
    }
    const ok = res.status === 200;
    if (!ok) failed++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${res.status} ${url}${note}`);
  } catch (error) {
    failed++;
    console.log(`FAIL ---- ${url} (${error.message})`);
  }
}
console.log(failed ? `\n${failed} problem(s) found.` : `\nAll ${urls.size} external links are live.`);
process.exit(failed ? 1 : 0);
