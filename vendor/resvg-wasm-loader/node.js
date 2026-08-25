// Node fallback (build-time prerender): compile the wasm from disk.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default new WebAssembly.Module(
	readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm'))
);
