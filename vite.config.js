import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const APP_VERSION = process.env.VITE_APP_VERSION || pkg.version;
const GIT_SHA = process.env.GIT_SHORT_SHA || 'dev';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __GIT_SHA__: JSON.stringify(GIT_SHA)
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.monkeycode-ai.online', '.mcode.side419.cn']
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['.monkeycode-ai.online', '.mcode.side419.cn']
  },
  build: {
    outDir: 'dist',
    target: 'es2020'
  }
});
