import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		// Keep the wasm imports out of Vite's graph; wrangler's CompiledWasm
		// rule compiles the .wasm files into WebAssembly.Modules at bundle time.
		external: ['resvg-wasm-loader', 'yoga-wasm-loader']
	}
});
