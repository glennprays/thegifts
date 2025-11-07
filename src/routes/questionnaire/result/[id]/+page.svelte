<script lang="ts">
  import { goto } from "$app/navigation";
  import Arrow from "$lib/icons/Arrow.svelte";
  import Share from "$lib/icons/Share.svelte";
  import { _ } from "svelte-i18n";
  export let data: {
    name: string;
    result: { category: string; score: number }[];
  };

  const maxScore = 25;

  function shareResults() {
    const url = window.location.href;
    const text = `${data.name}'s Spiritual Gifts assessment results — check out their gifts!`;
    const title = "Spiritual Gifts Assessment Results";
    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }
</script>

<div class="mb-10">
  <div class="max-w-xl mx-auto mt-8 bg-white shadow-md rounded-xl p-6 relative">
    <div>
      <button
        on:click={shareResults}
        class="absolute top-4 right-4 bg-white hover:bg-gray-50 text-gray-700 p-2.5 rounded-full shadow-md transition-all duration-200 hover:shadow-lg"
        aria-label="Share Results"
      >
        <Share />
      </button>

      <h1 class="text-xl font-semibold text-gray-800 mb-4 text-center">
        {$_("pages.result.title")}
      </h1>
      <p class="text-gray-600">
        {$_("pages.result.name")}: <span class="font-medium">{data.name}</span>
      </p>
      <h2 class="mb-4">{$_("pages.result.intro")}</h2>
    </div>
    <ul class="space-y-2 mb-6">
      {#each data.result as item, i}
        <li>
          <button
            on:click={() => goto(`/gifts/${item.category.toLowerCase()}`)}
            class="w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-md cursor-pointer text-left"
          >
            <div class="flex justify-between items-center text-sm mb-1">
              <span class="font-medium text-gray-700 capitalize">
                {item.category}
              </span>
              <div class="flex items-center gap-2">
                <span class="text-gray-600 font-semibold"
                  >{item.score}<span class="font-light">/25</span></span
                >
                <Arrow />
              </div>
            </div>
            <div
              class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden relative"
            >
              <div
                class="h-2.5 rounded-full transition-all duration-300 relative"
                style="
                  width: {(item.score / maxScore) * 100}%;
                  background: linear-gradient(90deg, 
                    hsl({(i * 40) % 360}, 70%, 60%), 
                    hsl({(i * 40) % 360}, 70%, 50%)
                  );
                "
              >
                <div
                  class="absolute inset-0 rounded-full"
                  style="
                    background: linear-gradient(180deg, 
                      rgba(255, 255, 255, 0.3) 0%, 
                      rgba(255, 255, 255, 0) 50%,
                      rgba(0, 0, 0, 0.1) 100%
                    );
                  "
                ></div>
              </div>
            </div>
          </button>
        </li>
      {/each}
    </ul>
  </div>
</div>
