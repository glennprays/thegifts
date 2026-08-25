<script lang="ts">
  import "../app.css";
  import { MetaTags } from "svelte-meta-tags";
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.svg" />
  <title>Spiritual Gift Test - Discover Your Given Gifts</title>
  <meta
    name="description"
    content="Discover your given spiritual gifts with our comprehensive Spiritual Gift Test. Uncover your unique purpose and how you can serve others effectively."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Bitter:ital,wght@0,500;0,600;0,700;1,500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children()}

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
