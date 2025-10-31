<script lang="ts">
  import favicon from "$lib/assets/logo.svg";
  import Footer from "$lib/components/Footer.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import { page } from "$app/stores";

  let { children } = $props();
  import "../app.css";
  const hideFooterPaths = ["/questionnaire", "/onboarding"];
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />
{@render children?.()}
{#if !hideFooterPaths.includes($page.url.pathname)}
  <Footer />
{/if}
