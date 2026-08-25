import { initWasm } from '@resvg/resvg-wasm';

const globalState = globalThis as unknown as {
	__resvgInitPromise?: Promise<void>;
};

/**
 * Initialize the resvg WASM module (once per isolate).
 *
 * The wasm import is dynamic so it is never executed at build time:
 * Vite keeps `resvg-wasm-loader` external (see vite.config.ts ssr.external),
 * and wrangler's CompiledWasm rule compiles the .wasm into a
 * WebAssembly.Module when bundling the Worker.
 */
export function initResvg(): Promise<void> {
	globalState.__resvgInitPromise ??= (async () => {
		const { default: resvgWasmModule } = await import('resvg-wasm-loader');
		await initWasm(resvgWasmModule as unknown as WebAssembly.Module);
	})().catch((err) => {
		globalState.__resvgInitPromise = undefined;
		throw err;
	});
	return globalState.__resvgInitPromise;
}
