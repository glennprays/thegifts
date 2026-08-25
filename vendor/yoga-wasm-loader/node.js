// Node fallback (build-time prerender): compile the wasm from disk.
import { readFileSync } from 'node:fs';

export default new WebAssembly.Module(
	readFileSync(new URL('./yoga.wasm', import.meta.url))
);
