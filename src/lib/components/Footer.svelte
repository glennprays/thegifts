<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  const currentYear = new Date().getFullYear();
  $: lang = $page.params.lang || "en";
</script>

<footer class="w-full py-12 px-6">
  <div class="max-w-6xl mx-auto" style="position:relative;z-index:1;">
    <!-- Main row -->
    <div class="flex flex-col md:flex-row justify-between gap-10 md:gap-6">
      <!-- Brand block -->
      <div class="max-w-xs">
        <div class="tag-pill">✦ Spiritual Gifts</div>
        <h3 class="serif text-3xl text-white mb-3 leading-tight">TheGifts</h3>
        <p class="text-sm leading-relaxed" style="color:rgba(255,255,255,0.5);">
          {$_("components.footer.about")}
        </p>
      </div>

      <!-- Links block -->
      <div class="flex flex-col gap-3 md:pt-1">
        <span
          class="text-xs font-semibold tracking-widest uppercase"
          style="color:rgba(143,184,64,0.7);"
        >
          Navigate
        </span>
        <nav class="flex flex-col gap-3">
          <a href="/{lang}" class="footer-link"
            >{$_("components.footer.links.home")}</a
          >
          <a href="/{lang}/gifts" class="footer-link"
            >{$_("components.footer.links.gifts")}</a
          >
          <a href="/{lang}/onboarding" class="footer-link"
            >{$_("components.footer.links.takeTest")}</a
          >
        </nav>
      </div>
    </div>

    <!-- Divider -->
    <div class="organic-divider"></div>

    <!-- Copyright row -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
      <p class="text-xs" style="color:rgba(255,255,255,0.3);">
        &copy; {currentYear} TheGifts. {$_("components.footer.copyright")}
      </p>
      <p class="text-xs" style="color:rgba(255,255,255,0.2);">thegifts.site</p>
    </div>
  </div>
</footer>

<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  footer {
    font-family: "DM Sans", sans-serif;
    background: linear-gradient(160deg, #2a4010 0%, #1e3008 50%, #243810 100%);
    position: relative;
    overflow: hidden;
  }

  /* Organic background glows */
  footer::before {
    content: "";
    position: absolute;
    top: -60px;
    left: -80px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.15) 0%,
      transparent 65%
    );
    pointer-events: none;
  }
  footer::after {
    content: "";
    position: absolute;
    bottom: -40px;
    right: -60px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(143, 184, 64, 0.1) 0%,
      transparent 65%
    );
    pointer-events: none;
  }

  .serif {
    font-family: "DM Serif Display", serif;
  }

  .footer-link {
    color: rgba(255, 255, 255, 0.55);
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;
    position: relative;
  }
  .footer-link::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: rgba(143, 184, 64, 0.8);
    transition: width 0.25s ease;
  }
  .footer-link:hover {
    color: rgba(255, 255, 255, 0.95);
  }
  .footer-link:hover::after {
    width: 100%;
  }

  .organic-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 20%,
      rgba(255, 255, 255, 0.08) 80%,
      transparent 100%
    );
    margin: 24px 0 20px;
  }

  .tag-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: rgba(143, 184, 64, 0.15);
    color: rgba(143, 184, 64, 0.9);
    border: 1px solid rgba(143, 184, 64, 0.2);
    margin-bottom: 12px;
  }
</style>
