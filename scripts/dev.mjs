import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const apiProcess = spawn(process.execPath, [path.join(repoRoot, 'apps/api/server.js')], {
  cwd: repoRoot,
  stdio: 'inherit'
});

const webProcess = spawn(process.execPath, [path.join(repoRoot, 'node_modules/vite/bin/vite.js')], {
  cwd: repoRoot,
  stdio: 'inherit'
});

const children = [apiProcess, webProcess];
let isShuttingDown = false;

function shutdown(code = 0) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  children.forEach((child) => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  });

  setTimeout(() => process.exit(code), 50);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

apiProcess.on('exit', (code) => {
  if (isShuttingDown) {
    return;
  }

  shutdown(code || 0);
});

webProcess.on('exit', (code) => {
  if (isShuttingDown) {
    return;
  }

  shutdown(code || 0);
});
