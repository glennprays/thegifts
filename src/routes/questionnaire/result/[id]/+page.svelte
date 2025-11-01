<script lang="ts">
  import { _ } from "svelte-i18n";

  export let data: {
    name: string;
    result: { category: string; score: number }[];
  };

  const maxScore = Math.max(...data.result.map((r) => r.score));

  function shareResults() {
    const url = window.location.href;
    const text = `${data.name}'s assessment results — check out their performance and insights!`;
    const title = "Assessment Results";

    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      // fallback: copy link to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }
</script>

<div class="mb-10">
  <div class="max-w-xl mx-auto mt-8 bg-white shadow-md rounded-xl p-6">
    <div>
      <h1 class="text-xl font-semibold text-gray-800 mb-4 text-center">
        {$_("pages.result.title")}
      </h1>
      <p class="text-gray-600">
        Name: <span class="font-medium">{data.name}</span>
      </p>
      <h2 class="mb-4">{$_("pages.result.intro")}</h2>
    </div>

    <ul class="space-y-2 mb-6">
      {#each data.result as item, i}
        <li class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <div class="flex justify-between items-center text-sm mb-1">
            <span class="font-medium text-gray-700 capitalize">
              {item.category}
            </span>
            <span class="text-gray-600 font-semibold">{item.score}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full transition-all duration-300"
              style="
                width: {(item.score / maxScore) * 100}%;
                background-color: hsl({(i * 40) % 360}, 70%, 55%);
              "
            ></div>
          </div>
        </li>
      {/each}
    </ul>

    <div class="flex justify-center">
      <button
        on:click={shareResults}
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M16 8l4-4m-4 0h4v4M8 16l-4 4m4 0H4v-4"
          />
        </svg>
        Share Results
      </button>
    </div>
  </div>
</div>
