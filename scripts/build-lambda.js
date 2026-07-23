// Builds a deployable Lambda bundle at dist-lambda/ containing:
//   - index.js (esbuild bundle of src/lambda.ts, all deps inlined except @prisma/client)
//   - node_modules/@prisma/client + node_modules/.prisma (native query engine, can't be bundled)
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'dist-lambda');

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: root, stdio: 'inherit' });
}

// Skip files that bloat the deployment package but aren't needed at Lambda
// runtime (Amazon Linux, native binary query engine only):
//   - non-Linux query engine binaries (windows/darwin), only rhel-openssl-3.0.x is used
//   - wasm query engine fallbacks (we use the native binary engine, not wasm)
//   - .d.ts type declaration files (not needed at runtime)
function shouldSkip(name) {
  if (/query_engine|libquery_engine/i.test(name) && !/rhel-openssl/i.test(name)) return true;
  if (name.endsWith('.wasm')) return true;
  if (name.endsWith('.d.ts')) return true;
  return false;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isFile() && shouldSkip(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

run('npx prisma generate');

run(
  [
    'npx esbuild src/lambda.ts',
    '--bundle',
    '--platform=node',
    '--target=node20',
    '--minify',
    '--external:@prisma/client',
    '--external:.prisma/client',
    `--outfile=${path.join('dist-lambda', 'index.js')}`,
  ].join(' ')
);

copyDir(
  path.join(root, 'node_modules', '@prisma', 'client'),
  path.join(outDir, 'node_modules', '@prisma', 'client')
);
copyDir(
  path.join(root, 'node_modules', '.prisma'),
  path.join(outDir, 'node_modules', '.prisma')
);

fs.writeFileSync(
  path.join(outDir, 'package.json'),
  JSON.stringify({ name: 'carepath-lambda', version: '1.0.0', private: true }, null, 2)
);

console.log(`Lambda bundle ready at ${outDir}`);
