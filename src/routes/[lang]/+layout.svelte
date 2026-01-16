<script lang="ts">
	import { initI18n } from '$lib/i18n';
	import type { LayoutData } from './$types';

	let { data }: { data: LayoutData } = $props();

	// Initialize i18n with server-provided locale (NOT in onMount)
	initI18n(data.lang);
</script>

<slot />
