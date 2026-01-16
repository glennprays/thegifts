<script lang="ts">
	import { initI18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data }: { data: LayoutData } = $props();

	// Initialize i18n with server-provided locale (NOT in onMount)
	initI18n(data.lang);

	const currentPath = $derived($page.url.pathname.replace(/^\/[a-z]{2}/, ''));
	const baseUrl = $derived($page.url.origin);
</script>

<svelte:head>
	<link rel="alternate" hreflang="en" href="{baseUrl}/en{currentPath}" />
	<link rel="alternate" hreflang="id" href="{baseUrl}/id{currentPath}" />
	<link rel="alternate" hreflang="x-default" href="{baseUrl}/en{currentPath}" />
</svelte:head>

<slot />
