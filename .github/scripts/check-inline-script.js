const fs = require('fs');
const { execFileSync } = require('child_process');
const os = require('os');
const path = require('path');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node check-inline-script.js <html files...>');
  process.exit(2);
}

let failed = false;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!scripts.length) {
    console.error(`${file}: no inline <script> block found`);
    failed = true;
    continue;
  }
  const tmp = path.join(os.tmpdir(), `inline-${path.basename(file)}.check.js`);
  fs.writeFileSync(tmp, scripts.join('\n;\n'));
  try {
    execFileSync(process.execPath, ['--check', tmp], { stdio: 'inherit' });
    console.log(`${file}: syntax OK`);
  } catch (e) {
    failed = true;
  } finally {
    try { fs.unlinkSync(tmp); } catch (_) {}
  }
}
process.exit(failed ? 1 : 0);
