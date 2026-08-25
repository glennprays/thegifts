// Patches satori's inlined yoga-layout emscripten loader to work on
// Cloudflare Workers, where runtime WebAssembly compilation is banned.
//
// workerd only allows wasm that is statically imported (wrangler's
// CompiledWasm rule -> WebAssembly.Module) and instantiated with the sync
// `new WebAssembly.Instance(module, imports)`. satori's inlined yoga glue
// instead decodes an embedded base64 blob and calls the async
// `WebAssembly.instantiate(bytes, imports)` — which throws
// "Wasm code generation disallowed by embedder" on Workers.
//
// This script swaps every async instantiation in satori's yoga glue for the
// sync path, sourcing the module from the `yoga-wasm-loader` package
// (CompiledWasm import). Run automatically on npm install (see "postinstall").

import { readFileSync, writeFileSync } from 'node:fs';

const FILES = [
	'node_modules/satori/dist/index.js',
	'node_modules/satori/dist/standalone.js'
];

const IMPORT_LINE = "import yogaWasmModule from 'yoga-wasm-loader';\n";
// Matches `WebAssembly.instantiate(<bytesVar>, <importsVar>)` in the yoga glue
const PATTERN = /WebAssembly\.instantiate\(([A-Za-z_$][\w$]*),([A-Za-z_$][\w$]*)\)/g;
// Sync instantiation from the statically imported, pre-compiled module.
// Returns the same { instance, module } shape emscripten expects.
const REPLACEMENT =
	'function(M,I){return{instance:new WebAssembly.Instance(M,I),module:M}}(yogaWasmModule,$2)';

for (const file of FILES) {
	let src = readFileSync(file, 'utf8');

	if (src.includes('yoga-wasm-loader')) {
		console.log(`[patch-satori] already patched: ${file}`);
		continue;
	}

	const count = src.match(PATTERN)?.length ?? 0;
	if (count === 0) {
		console.warn(`[patch-satori] pattern not found (skipping): ${file}`);
		continue;
	}

	src = src.replace(PATTERN, REPLACEMENT);
	src = IMPORT_LINE + src;

	writeFileSync(file, src);
	console.log(`[patch-satori] patched ${count} instantiate call(s): ${file}`);
}
