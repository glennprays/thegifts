<script lang="ts">
  import type { GlyphName } from "$lib/data/gift-colors";
  import { GIFT_MARK_PATHS } from "$lib/data/gift-mark-paths";

  export let glyph: GlyphName;
  export let color: string = "#1b1b1b";
</script>

<!-- Hand-built naive illustration marks: bold ink outlines, accent fills -->
<svg
  viewBox="0 0 64 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  class="gift-mark"
>
  {@html GIFT_MARK_PATHS[glyph](color)}
</svg>

<style>
  .gift-mark {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
