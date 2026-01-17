<script lang="ts">
	import { initI18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { isLoading } from 'svelte-i18n';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// Initialize i18n with server-provided locale (NOT in onMount)
	initI18n(data.lang);

	const currentPath = $derived($page.url.pathname.replace(/^\/[a-z]{2}/, ''));
	const baseUrl = $derived($page.url.origin);
	const hideFooter = $derived(
		['/onboarding', '/questionnaire'].some((path) => $page.url.pathname.endsWith(path))
	);
</script>

<svelte:head>
	<link rel="alternate" hreflang="en" href="{baseUrl}/en{currentPath}" />
	<link rel="alternate" hreflang="id" href="{baseUrl}/id{currentPath}" />
	<link rel="alternate" hreflang="x-default" href="{baseUrl}/en{currentPath}" />
</svelte:head>

{#if $isLoading}
	<Loading text="" />
{:else}
	<Navbar />
	{@render children()}
	{#if !hideFooter}
		<Footer />
	{/if}
{/if}
