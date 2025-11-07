<script lang="ts">
  import { getLocaleFromNavigator, isLoading, locale } from "svelte-i18n";
  import { browser } from "$app/environment";
  import "$lib/i18n";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { page } from "$app/stores";
  import "../app.css";
  import { MetaTags } from "svelte-meta-tags";
  import Loading from "$lib/components/Loading.svelte";

  const hideFooterPaths = ["/questionnaire", "/onboarding"];

  if (browser) {
    locale.set(window.navigator.language.split("-")[0]);
  }
</script>

<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.ico" />
  <title>Spiritual Gift Test - Discover Your God-Given Gifts</title>
  <meta
    name="description"
    content="Discover your given spiritual gifts with our comprehensive Spiritual Gift Test. Uncover your unique purpose and how you can serve others effectively."
  />
</svelte:head>

{#if $isLoading}
  <Loading text="" />
{:else}
  <Navbar />
  <slot />
  {#if !hideFooterPaths.includes($page.url.pathname)}
    <Footer />
  {/if}
{/if}

<MetaTags
  openGraph={{
    type: "website",
    url: "https://thegifts.site",
    images: [
      {
        url: "https://thegifts.site/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Spiritual Gift Test",
      },
    ],
  }}
/>
