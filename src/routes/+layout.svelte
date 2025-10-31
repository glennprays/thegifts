<script lang="ts">
  import favicon from "$lib/assets/logo.svg";
  import Footer from "$lib/components/Footer.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import { page } from "$app/stores";
  import { MetaTags } from "svelte-meta-tags";

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

<MetaTags
  openGraph={{
    title: "Spiritual Gift Test",
    description:
      "Discover your God-given spiritual gifts with our comprehensive Spiritual Gift Test. Uncover your unique purpose and how you can serve others effectively.",
    type: "website",
    url: "https://thegifts.site",
    images: [
      {
        url: "https://thegifts.site/images/og.png",
        width: 1200,
        height: 630,
        alt: "Spiritual Gift Test",
      },
    ],
  }}
/>
