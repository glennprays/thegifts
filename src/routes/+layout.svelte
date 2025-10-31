<script lang="ts">
  import { getLocaleFromNavigator, isLoading, locale } from "svelte-i18n";
  import { browser } from "$app/environment";
  import "$lib/i18n";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { page } from "$app/stores";
  import "../app.css";
  import { MetaTags } from "svelte-meta-tags";

  const hideFooterPaths = ["/questionnaire", "/onboarding"];

  if (browser) {
    // Fallback safety if locale isn't set yet
    locale.set(window.navigator.language.split("-")[0]);
  }
</script>

{#if $isLoading}
  <div class="flex items-center justify-center min-h-screen">
    <p>Loading translations...</p>
  </div>
{:else}
  <Navbar />
  <slot />
  {#if !hideFooterPaths.includes($page.url.pathname)}
    <Footer />
  {/if}
{/if}

<MetaTags
  openGraph={{
    title: "Spiritual Gift Test",
    description:
      "Discover your God-given spiritual gifts with our comprehensive Spiritual Gift Test. Uncover your unique purpose and how you can serve others effectively.",
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

<MetaTags
  openGraph={{
    title: "Spiritual Gift Test",
    description:
      "Discover your God-given spiritual gifts with our comprehensive Spiritual Gift Test. Uncover your unique purpose and how you can serve others effectively.",
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
