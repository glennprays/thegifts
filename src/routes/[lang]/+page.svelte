<script lang="ts">
  import { NAME_STORAGE_KEY } from "$lib/constants/constants";
  import Book from "$lib/icons/Book.svelte";
  import Diversity from "$lib/icons/Diversity.svelte";
  import Restart from "$lib/icons/Restart.svelte";
  import Sprout from "$lib/icons/Sprout.svelte";
  import { RestartTest } from "$lib/utils/utils";
  import { getAllCategoryExplanations } from "$lib/utils/category-explanation";
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
  let visible = false;

  onMount(() => {
    savedName = localStorage.getItem(NAME_STORAGE_KEY);
    requestAnimationFrame(() => {
      visible = true;
    });
  });

  function scrollToPillars() {
    if (typeof document !== "undefined") {
      document
        .getElementById("three-pillars")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<!-- ── HERO ──────────────────────────────────────────────────────── -->
<section class="hero-section w-full min-h-screen flex flex-col">
  <!-- Content -->
  <div
    class="flex flex-col items-center justify-center text-center flex-grow z-10
              px-6 sm:px-10 md:px-20 lg:px-36 xl:px-52 pt-24 pb-10"
  >
    <div class="reveal {visible ? 'in' : ''}">
      <div class="tag-pill mb-6">
        Spiritual Gifts Assessment
      </div>
    </div>

    <h1
      class="serif reveal reveal-d1 {visible ? 'in' : ''}
               text-4xl sm:text-5xl md:text-6xl lg:text-7xl
               leading-tight text-[#1a2e05] mb-6"
    >
      {$_("pages.home.greeting.text")}
      <span class="italic" style="color:#6b8f27;"
        >{$_("pages.home.greeting.subject")}</span
      >.
    </h1>

    <p
      class="reveal reveal-d2 {visible ? 'in' : ''}
              text-base sm:text-lg md:text-xl text-[#4a5e2a]/70 max-w-xl leading-relaxed mb-10"
    >
      {$_("pages.home.greeting.subtext")}
    </p>

    <div
      class="reveal reveal-d3 {visible
        ? 'in'
        : ''} flex flex-col sm:flex-row items-center gap-4 mb-14"
    >
      <a href="/{lang}/onboarding" class="cta-primary">
        {$_("pages.home.callToAction.buttons.startTest")}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
        >
      </a>
      <a href="/{lang}/gifts" class="cta-secondary">
        {$_("pages.home.exploreGifts.viewAllDetails")}
      </a>
    </div>

    <button
      class="scroll-btn reveal reveal-d4 {visible ? 'in' : ''}"
      aria-label="Scroll down"
      on:click={scrollToPillars}
    >
      <svg
        class="w-8 h-8"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  </div>

  <!-- Mosaic strip -->
  <div class="mosaic-strip w-full h-[180px] sm:h-[220px] md:h-[280px] shrink-0">
    <img
      src="/images/home-mozaic.webp"
      fetchpriority="high"
      alt="Home Mosaic"
      class="w-full h-full object-cover object-center"
    />
  </div>
</section>

<!-- ── THREE PILLARS ────────────────────────────────────────────── -->
<section id="three-pillars" class="pillars-section w-full py-24 px-6">
  <div
    class="max-w-4xl mx-auto text-center mb-16"
    style="position:relative;z-index:1;"
  >
    <div class="section-eyebrow">Why TheGifts</div>
    <h2 class="serif text-4xl sm:text-5xl text-[#1a2e05] leading-tight mb-4">
      {$_("pages.home.description.heading")}
    </h2>
    <p
      class="text-[#4a5e2a]/65 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
    >
      {$_("pages.home.description.subheading")}
    </p>
  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
    style="position:relative;z-index:1;"
  >
    <!-- Learn -->
    <div class="pillar-card p1">
      <div
        class="pillar-icon"
        style="background: linear-gradient(135deg,#eef0ff,#d8e0ff);"
      >
        <Book />
      </div>
      <h3 class="serif text-xl text-[#1a2e05] mb-3">
        {$_("pages.home.description.pillars.pillar1.title")}
      </h3>
      <p class="text-sm text-[#4a5e2a]/65 leading-relaxed">
        {$_("pages.home.description.pillars.pillar1.text")}
      </p>
    </div>

    <!-- Grow -->
    <div class="pillar-card p2">
      <div
        class="pillar-icon"
        style="background: linear-gradient(135deg,#edf8e4,#d0edb8);"
      >
        <Sprout />
      </div>
      <h3 class="serif text-xl text-[#1a2e05] mb-3">
        {$_("pages.home.description.pillars.pillar2.title")}
      </h3>
      <p class="text-sm text-[#4a5e2a]/65 leading-relaxed">
        {$_("pages.home.description.pillars.pillar2.text")}
      </p>
    </div>

    <!-- Serve -->
    <div class="pillar-card p3">
      <div
        class="pillar-icon"
        style="background: linear-gradient(135deg,#fef8e4,#fdedb8);"
      >
        <Diversity />
      </div>
      <h3 class="serif text-xl text-[#1a2e05] mb-3">
        {$_("pages.home.description.pillars.pillar3.title")}
      </h3>
      <p class="text-sm text-[#4a5e2a]/65 leading-relaxed">
        {$_("pages.home.description.pillars.pillar3.text")}
      </p>
    </div>
  </div>
</section>

<!-- ── EXPLORE GIFTS ─────────────────────────────────────────────── -->
<section class="explore-section w-full py-24 px-6">
  <div class="max-w-5xl mx-auto" style="position:relative;z-index:1;">
    <div class="text-center mb-14">
      <div class="section-eyebrow">Discover</div>
      <h2 class="serif text-4xl sm:text-5xl text-[#1a2e05] leading-tight mb-4">
        {$_("pages.home.exploreGifts.title")}
      </h2>
      <p
        class="text-[#4a5e2a]/65 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
      >
        {$_("pages.home.exploreGifts.subtitle")}
      </p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
      {#each featuredCategories as category}
        <a href="/{lang}/gifts/{category.key}" class="gift-card">
          <h3
            class="font-semibold text-[#1a2e05] text-sm md:text-base leading-snug"
          >
            {category.name}
          </h3>
          <span class="text-xs text-[#8aab52] mt-1 font-medium">Explore →</span>
        </a>
      {/each}
    </div>

    <div class="text-center">
      <a href="/{lang}/gifts" class="cta-primary inline-flex">
        {$_("pages.home.exploreGifts.viewAllDetails")}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
        >
      </a>
    </div>
  </div>
</section>

<!-- ── CALL TO ACTION ─────────────────────────────────────────────── -->
<section
  class="cta-section w-full py-24 px-6 flex flex-col items-center text-center"
>
  <div class="max-w-2xl mx-auto" style="position:relative;z-index:1;">
    {#if savedName}
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
        style="background:rgba(143,184,64,0.15);color:rgba(143,184,64,0.9);border:1px solid rgba(143,184,64,0.2);"
      >
        Welcome back, {savedName}
      </div>
    {:else}
      <div class="section-eyebrow" style="color:rgba(143,184,64,0.7);">
        <span
          style="background:rgba(143,184,64,0.2);width:32px;height:1px;display:block;"
        ></span>
        Start Today
        <span
          style="background:rgba(143,184,64,0.2);width:32px;height:1px;display:block;"
        ></span>
      </div>
    {/if}

    <h2
      class="serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-5"
    >
      {$_("pages.home.callToAction.text")}
    </h2>

    <p
      class="text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed"
      style="color:rgba(255,255,255,0.6);"
    >
      {$_("pages.home.callToAction.subtext")}
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href="/{lang}/{savedName ? 'questionnaire' : 'onboarding'}"
        class="cta-white-btn"
      >
        {savedName
          ? $_("pages.home.callToAction.buttons.continueTest")
          : $_("pages.home.callToAction.buttons.startTest")}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
        >
      </a>

      {#if savedName}
        <a
          href="/{lang}/onboarding"
          on:click={RestartTest}
          class="cta-ghost-btn"
        >
          <Restart />
          {$_("pages.home.callToAction.buttons.restartTest")}
        </a>
      {/if}
    </div>
  </div>
</section>

<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  :global(body) {
    font-family: "DM Sans", sans-serif;
  }
  .serif {
    font-family: "DM Serif Display", serif;
  }

  /* ── Hero ─────────────────────────────────────────────── */
  .hero-section {
    background: linear-gradient(160deg, #f7f3eb 0%, #eef5e4 55%, #f2efe6 100%);
    position: relative;
    overflow: hidden;
  }
  .hero-section::before {
    content: "";
    position: absolute;
    top: -100px;
    right: -120px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.09) 0%,
      transparent 65%
    );
    pointer-events: none;
  }
  .hero-section::after {
    content: "";
    position: absolute;
    bottom: 40px;
    left: -80px;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(143, 184, 64, 0.07) 0%,
      transparent 65%
    );
    pointer-events: none;
  }

  /* Reveal animation */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.in {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-d1 {
    transition-delay: 0.08s;
  }
  .reveal-d2 {
    transition-delay: 0.18s;
  }
  .reveal-d3 {
    transition-delay: 0.28s;
  }
  .reveal-d4 {
    transition-delay: 0.38s;
  }

  /* Tag pill */
  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: rgba(107, 143, 39, 0.1);
    color: #4a6518;
    border: 1px solid rgba(107, 143, 39, 0.2);
  }

  /* Hero CTA button */
  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #3d5a12, #6b8f27);
    color: white;
    font-weight: 600;
    font-size: 16px;
    padding: 14px 32px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(74, 101, 24, 0.25);
    position: relative;
    overflow: hidden;
  }
  .cta-primary::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 60%;
    height: 200%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 60%
    );
  }
  .cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(74, 101, 24, 0.3);
  }

  .cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #4a6518;
    font-weight: 500;
    font-size: 15px;
    padding: 14px 24px;
    border-radius: 14px;
    border: 1.5px solid rgba(107, 143, 39, 0.3);
    text-decoration: none;
    transition:
      background 0.2s,
      border-color 0.2s;
  }
  .cta-secondary:hover {
    background: rgba(107, 143, 39, 0.06);
    border-color: rgba(107, 143, 39, 0.5);
  }

  /* Scroll indicator */
  .scroll-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #8aab52;
    opacity: 0.7;
    animation: bob 2s ease-in-out infinite;
    transition: opacity 0.2s;
  }
  .scroll-btn:hover {
    opacity: 1;
  }
  @keyframes bob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(7px);
    }
  }

  /* ── Mosaic strip ─────────────────────────────────────── */
  .mosaic-strip {
    position: relative;
    overflow: hidden;
  }
  .mosaic-strip::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      180deg,
      #f3f0e8 0%,
      transparent 25%,
      transparent 75%,
      #f8f5ef 100%
    );
  }

  /* ── Pillars ──────────────────────────────────────────── */
  .pillars-section {
    background: linear-gradient(175deg, #f8f5ef 0%, #eef5e4 100%);
    position: relative;
    overflow: hidden;
  }
  .pillars-section::before {
    content: "";
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 300px;
    background: radial-gradient(
      ellipse,
      rgba(107, 143, 39, 0.06) 0%,
      transparent 70%
    );
    pointer-events: none;
  }

  .pillar-card {
    background: white;
    border-radius: 24px;
    padding: 36px 28px;
    text-align: center;
    border: 1px solid #e8f0d8;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;
    position: relative;
    overflow: hidden;
  }
  .pillar-card::before {
    content: "";
    position: absolute;
    bottom: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .pillar-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(74, 101, 24, 0.1);
  }
  .pillar-card:hover::before {
    opacity: 1;
  }
  .pillar-card.p1:hover {
    border-color: #c8daf8;
  }
  .pillar-card.p2:hover {
    border-color: #c8e8b0;
  }
  .pillar-card.p3:hover {
    border-color: #f8e8a0;
  }
  .pillar-card.p1::before {
    background: radial-gradient(
      circle,
      rgba(99, 130, 220, 0.06) 0%,
      transparent 70%
    );
  }
  .pillar-card.p2::before {
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.07) 0%,
      transparent 70%
    );
  }
  .pillar-card.p3::before {
    background: radial-gradient(
      circle,
      rgba(200, 150, 30, 0.06) 0%,
      transparent 70%
    );
  }

  .pillar-icon {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  /* ── Explore gifts ────────────────────────────────────── */
  .explore-section {
    background: linear-gradient(170deg, #f0f8e4 0%, #f7f3eb 100%);
    position: relative;
    overflow: hidden;
  }
  .explore-section::after {
    content: "";
    position: absolute;
    bottom: -80px;
    right: -80px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.07) 0%,
      transparent 65%
    );
    pointer-events: none;
  }

  .gift-card {
    background: white;
    border-radius: 18px;
    padding: 20px 16px;
    text-align: center;
    border: 1px solid #e8f0d8;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      border-color 0.2s;
    position: relative;
    overflow: hidden;
  }
  .gift-card::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a6518, #8fb840);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .gift-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 32px rgba(74, 101, 24, 0.12);
    border-color: #c8e0a0;
  }
  .gift-card:hover::after {
    transform: scaleX(1);
  }

  /* ── CTA section ──────────────────────────────────────── */
  .cta-section {
    background: linear-gradient(145deg, #2a4010 0%, #1e3008 50%, #3a5818 100%);
    position: relative;
    overflow: hidden;
  }
  .cta-section::before {
    content: "";
    position: absolute;
    top: -80px;
    left: -80px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.18) 0%,
      transparent 65%
    );
    pointer-events: none;
  }
  .cta-section::after {
    content: "";
    position: absolute;
    bottom: -60px;
    right: -60px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(143, 184, 64, 0.12) 0%,
      transparent 65%
    );
    pointer-events: none;
  }

  .cta-white-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: white;
    color: #3d5a12;
    font-weight: 700;
    font-size: 16px;
    padding: 14px 32px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      background 0.2s;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
  .cta-white-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
    background: #f4fce8;
  }

  .cta-ghost-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.75);
    font-weight: 500;
    font-size: 14px;
    padding: 13px 22px;
    border-radius: 12px;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    text-decoration: none;
    background: rgba(255, 255, 255, 0.06);
    transition:
      background 0.2s,
      border-color 0.2s,
      color 0.2s;
  }
  .cta-ghost-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
  }

  /* Organic section divider */
  .section-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8aab52;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .section-eyebrow::before,
  .section-eyebrow::after {
    content: "";
    display: block;
    width: 32px;
    height: 1px;
    background: rgba(138, 171, 82, 0.4);
  }
</style>
