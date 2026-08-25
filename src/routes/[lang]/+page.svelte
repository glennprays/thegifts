<script lang="ts">
  import { NAME_STORAGE_KEY } from "$lib/constants/constants";
  import Restart from "$lib/icons/Restart.svelte";
  import { RestartTest } from "$lib/utils/utils";
  import { getAllCategoryExplanations } from "$lib/utils/category-explanation";
  import { giftColor } from "$lib/data/gift-colors";
  import GiftMark from "$lib/components/illustrations/GiftMark.svelte";
  import HeroIllustration from "$lib/components/illustrations/HeroIllustration.svelte";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";

  const lang = ($page.params.lang as "en" | "id") || "en";
  const allCategories = getAllCategoryExplanations(lang);

  const selectedGiftKeys = [
    "faith",
    "healing",
    "leadership",
    "mercy",
    "wisdom",
    "service",
  ];
  const featuredCategories = allCategories.filter((cat) =>
    selectedGiftKeys.includes(cat.key),
  );

  let savedName: string | null = null;

  onMount(() => {
    savedName = localStorage.getItem(NAME_STORAGE_KEY);
  });

  const pillars = [
    { glyph: "book", color: "#0d76cc", pale: "#e5f3ff", key: "pillar1" },
    { glyph: "plant", color: "#24843f", pale: "#e4fbe9", key: "pillar2" },
    { glyph: "heart", color: "#d22628", pale: "#ffe0e1", key: "pillar3" },
  ] as const;
</script>

<!-- ── HERO ──────────────────────────────────────────────────────── -->
<section class="hero w-full px-6 pt-16 pb-20">
  <div
    class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-center"
  >
    <div>
      <div class="press-in inline-flex items-center gap-2.5 mb-7">
        <svg viewBox="0 0 32 32" class="w-5 h-5" aria-hidden="true">
          <path
            d="M16 3 L20 12 L29 13 L22 19.5 L24 29 L16 24 L8 29 L10 19.5 L3 13 L12 12 Z"
            fill="#d97706"
            stroke="#1b1b1b"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
        </svg>
        <span class="smallcaps text-ink-faint">Spiritual Gifts Assessment</span>
      </div>

      <h1
        class="press-in press-in-d1 display text-4xl sm:text-5xl lg:text-6xl
               font-bold leading-[1.08] text-ink mb-6"
      >
        {$_("pages.home.greeting.text")}
        <span class="accent-word">{$_("pages.home.greeting.subject")}</span>.
      </h1>

      <p
        class="press-in press-in-d2 text-base sm:text-lg text-ink-faint max-w-lg leading-relaxed mb-9"
      >
        {$_("pages.home.greeting.subtext")}
      </p>

      <div class="press-in press-in-d3 flex flex-col sm:flex-row items-start gap-3">
        <a href="/{lang}/onboarding" class="btn-primary smallcaps">
          {$_("pages.home.callToAction.buttons.startTest")}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
        <a href="/{lang}/gifts" class="btn-outline smallcaps">
          {$_("pages.home.exploreGifts.viewAllDetails")}
        </a>
      </div>
    </div>

    <div class="press-in press-in-d2 hero-illo-wrap">
      <HeroIllustration />
    </div>
  </div>
</section>

<!-- ── THREE PILLARS ────────────────────────────────────────────── -->
<section id="three-pillars" class="w-full py-20 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="mb-12 press-in max-w-2xl">
      <h2 class="display text-3xl sm:text-4xl text-ink font-bold leading-tight mb-4">
        {$_("pages.home.description.heading")}
      </h2>
      <p class="text-ink-faint text-base sm:text-lg leading-relaxed">
        {$_("pages.home.description.subheading")}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {#each pillars as p, i (p.key)}
        <div class="pillar-card press-in press-in-d{i}">
          <div
            class="pillar-illo"
            style="background: {p.pale};"
          >
            <GiftMark glyph={p.glyph} color={p.color} />
          </div>
          <h3 class="display text-xl text-ink font-bold mb-3">
            {$_(`pages.home.description.pillars.${p.key}.title`)}
          </h3>
          <p class="text-sm text-ink-faint leading-relaxed">
            {$_(`pages.home.description.pillars.${p.key}.text`)}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── EXPLORE GIFTS ─────────────────────────────────────────────── -->
<section class="w-full py-20 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="mb-10 press-in">
      <h2 class="display text-3xl sm:text-4xl text-ink font-bold leading-tight mb-3">
        {$_("pages.home.exploreGifts.title")}
      </h2>
      <p class="text-ink-faint text-base sm:text-lg max-w-xl leading-relaxed">
        {$_("pages.home.exploreGifts.subtitle")}
      </p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      {#each featuredCategories as category, i (category.key)}
        {@const gc = giftColor(category.key)}
        <a
          href="/{lang}/gifts/{category.key}"
          class="gift-card press-in press-in-d{Math.min(i, 4)}"
          style="background: {gc.pale};"
        >
          <div class="gift-card-illo">
            <GiftMark glyph={gc.glyph} color={gc.accent} />
          </div>
          <h3 class="display font-bold text-ink text-base leading-snug">
            {category.name}
          </h3>
          <span class="gift-card-go">{$_("pages.home.exploreGifts.viewAllDetails")} →</span>
        </a>
      {/each}
    </div>

    <div class="press-in">
      <a href="/{lang}/gifts" class="btn-outline smallcaps inline-flex">
        {$_("pages.home.exploreGifts.viewAllDetails")}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </a>
    </div>
  </div>
</section>

<!-- ── CALL TO ACTION ─────────────────────────────────────────────── -->
<section class="w-full py-16 px-6">
  <div
    class="max-w-5xl mx-auto cta-band press-in px-8 py-14 sm:px-14 text-center"
  >
    <h2 class="display text-3xl sm:text-4xl md:text-5xl text-ink font-bold leading-tight mb-5">
      {$_("pages.home.callToAction.text")}
    </h2>

    <p class="text-base sm:text-lg mb-9 max-w-lg mx-auto leading-relaxed text-ink-soft">
      {$_("pages.home.callToAction.subtext")}
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a
        href="/{lang}/{savedName ? 'questionnaire' : 'onboarding'}"
        class="btn-primary smallcaps"
      >
        {savedName
          ? $_("pages.home.callToAction.buttons.continueTest")
          : $_("pages.home.callToAction.buttons.startTest")}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </a>

      {#if savedName}
        <a href="/{lang}/onboarding" on:click={RestartTest} class="btn-outline smallcaps" style="background:#ffffff;">
          <Restart />
          {$_("pages.home.callToAction.buttons.restartTest")}
        </a>
      {/if}
    </div>
  </div>
</section>

<style>
  .accent-word {
    font-style: italic;
    font-weight: 600;
    color: var(--color-amber);
    /* hand-underlined feel */
    text-decoration: underline;
    text-decoration-color: var(--color-amber-pale);
    text-decoration-thickness: 6px;
    text-underline-offset: 4px;
  }

  /* Buttons */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: var(--color-ink);
    color: var(--color-paper);
    padding: 16px 32px;
    border-radius: 999px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s, transform 0.15s;
    font-size: 11px;
  }
  .btn-primary:hover {
    background: var(--color-ink-soft);
    transform: translateY(-2px);
  }
  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--color-ink);
    padding: 15px 28px;
    border: 2px solid var(--color-line);
    border-radius: 999px;
    text-decoration: none;
    background: transparent;
    transition: border-color 0.15s, background 0.15s;
    font-size: 11px;
  }
  .btn-outline:hover {
    border-color: var(--color-ink);
  }

  /* Pillars */
  .pillar-card {
    background: #ffffff;
    border: 1px solid var(--color-line);
    border-radius: 24px;
    padding: 32px 28px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .pillar-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(27, 27, 27, 0.08);
  }
  .pillar-illo {
    width: 76px;
    height: 76px;
    border-radius: 22px;
    padding: 14px;
    margin-bottom: 20px;
  }

  /* Gift cards */
  .gift-card {
    border-radius: 20px;
    padding: 24px 20px 20px;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .gift-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(27, 27, 27, 0.1);
  }
  .gift-card-illo {
    width: 56px;
    height: 56px;
    margin-bottom: 12px;
  }
  .gift-card-go {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-ink-soft);
    margin-top: 8px;
    transition: transform 0.2s;
  }
  .gift-card:hover .gift-card-go {
    transform: translateX(3px);
  }

  /* CTA band */
  .cta-band {
    background: var(--color-amber-pale);
    border-radius: 32px;
  }
</style>
