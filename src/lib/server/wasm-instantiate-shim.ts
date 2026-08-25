/**
 * Cloudflare Workers (workerd) disallow `WebAssembly.instantiate()` /
 * `WebAssembly.compile()` — the async runtime-codegen APIs — but allow sync
 * `new WebAssembly.Module(bytes)` and `new WebAssembly.Instance(module, imports)`
 * for modules bundled via the CompiledWasm rule.
 *
 * Several wasm packages used by this app (yoga-layout via satori, wasm-bindgen
 * via @resvg/resvg-wasm) call the async APIs, so we shim them to route through
 * the supported sync path. Must be imported before any wasm consumer loads
 * (see src/hooks.server.ts).
 */

const globalState = globalThis as unknown as {
	__wasmInstantiateShimPatched?: boolean;
};

export function patchWebAssemblyInstantiate() {
	if (globalState.__wasmInstantiateShimPatched) return;
	globalState.__wasmInstantiateShimPatched = true;

	WebAssembly.instantiate = function (
		moduleOrBytes: WebAssembly.Module | Uint8Array,
		imports?: WebAssembly.Imports
	) {
		if (moduleOrBytes instanceof WebAssembly.Module) {
			const instance = new WebAssembly.Instance(moduleOrBytes, imports);
			return Promise.resolve({ instance, module: moduleOrBytes });
		}
		const compiled = new WebAssembly.Module(moduleOrBytes as unknown as BufferSource);
		const instance = new WebAssembly.Instance(compiled, imports);
		return Promise.resolve({ instance, module: compiled });
	} as typeof WebAssembly.instantiate;
}

patchWebAssemblyInstantiate();
