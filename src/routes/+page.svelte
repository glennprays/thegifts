<script lang="ts">
  import { NAME_STORAGE_KEY } from "$lib/constants/constants";
  import Book from "$lib/icons/Book.svelte";
  import Diversity from "$lib/icons/Diversity.svelte";
  import Restart from "$lib/icons/Restart.svelte";
  import Sprout from "$lib/icons/Sprout.svelte";
  import { RestartTest } from "$lib/utils/utils";
  import { onMount } from "svelte";

  let savedName: string | null = null;
  onMount(() => {
    savedName = localStorage.getItem(NAME_STORAGE_KEY);
  });
</script>

<div
  class="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden"
>
  <div
    class="flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-20 lg:px-36 xl:px-52 mt-16 md:mt-24 flex-grow z-10"
  >
    <h1
      class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold font-graphik leading-tight text-gray-900"
    >
      Understand the Purpose God Planted in
      <span class="text-secondary">You</span>.
    </h1>
    <p class="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
      Take the Spiritual Gift Test and uncover how you were designed to serve.
    </p>

    <button
      aria-label="Scroll to Three Pillars Section"
      on:click={() => {
        const section = document.getElementById("three-pillars");
        section?.scrollIntoView({ behavior: "smooth" });
      }}
      class="mt-10 mb-12 animate-bounce text-primary"
    >
      <svg
        class="w-8 h-8 md:w-10 md:h-10 mx-auto"
        fill="currentColor"
        viewBox="0 0 384 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m360.5 217.5-152 143.1c-4.6 5.2-10.6 7.4-16.5 7.4s-11.88-2.188-16.5-6.562l-152-143.938c-9.63-9.2-10.03-24.4-.94-34 9.13-9.7 24.38-10 33.94-.9l135.5 128.3 135.5-128.4c9.562-9.094 24.75-8.75 33.94.9375 9.06 9.6625 8.66 24.8625-.94 34.0625z"
        ></path>
      </svg>
    </button>
  </div>

  <div
    class="relative w-full h-[200px] sm:h-[260px] md:h-[300px] lg:h-[360px] overflow-hidden"
  >
    <img
      src="/images/home-mozaic.png"
      alt="Home Mosaic"
      class="absolute inset-0 w-full h-full object-cover object-center scale-110 sm:scale-125 md:scale-100"
    />
  </div>
</div>

<div
  id="three-pillars"
  class="relative w-full min-h-screen flex flex-col justify-center items-center text-gray-900 py-16 px-6"
>
  <div class="max-w-3xl text-center mb-16">
    <h2
      class="text-3xl sm:text-4xl md:text-5xl font-semibold font-graphik leading-tight mb-4"
    >
      Discover Your Gifts, Live with Purpose.
    </h2>
    <p class="text-gray-600 text-base sm:text-lg">
      Everyone has a unique gift. Learn to understand it, nurture it, and use it
      to make a difference.
    </p>
  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl w-full text-center"
  >
    <div
      class="group flex flex-col items-center bg-gray-50 rounded-2xl p-8 transition hover:-translate-y-2 hover:shadow-lg hover:bg-white duration-300"
    >
      <div
        class="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4 group-hover:bg-indigo-200 transition"
      >
        <Book />
      </div>
      <h3 class="text-xl font-semibold mb-2">Learn</h3>
      <p class="text-gray-600 text-sm sm:text-base">
        Deepen your understanding of who you are and what makes you unique
        through study and reflection.
      </p>
    </div>

    <div
      class="group flex flex-col items-center bg-gray-50 rounded-2xl p-8 transition hover:-translate-y-2 hover:shadow-lg hover:bg-white duration-300"
    >
      <div
        class="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 group-hover:bg-green-200 transition"
      >
        <Sprout />
      </div>
      <h3 class="text-xl font-semibold mb-2">Grow</h3>
      <p class="text-gray-600 text-sm sm:text-base">
        Cultivate your talents, strengthen your faith, and develop the character
        to live your calling.
      </p>
    </div>

    <div
      class="group flex flex-col items-center bg-gray-50 rounded-2xl p-8 transition hover:-translate-y-2 hover:shadow-lg hover:bg-white duration-300"
    >
      <div
        class="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4 group-hover:bg-yellow-200 transition"
      >
        <Diversity />
      </div>
      <h3 class="text-xl font-semibold mb-2">Serve</h3>
      <p class="text-gray-600 text-sm sm:text-base">
        Use your gifts to impact others, build community, and reflect compassion
        through action.
      </p>
    </div>
  </div>
</div>

<div
  class="w-full bg-primary text-white py-16 px-6 flex flex-col items-center text-center"
>
  {#if savedName}
    <h2 class="text-xl sm:text-2xl md:text-3xl font-graphik font-semibold mb-4">
      Hi {savedName}!
    </h2>
  {/if}
  <h2 class="text-3xl sm:text-4xl md:text-5xl font-graphik font-semibold mb-4">
    Ready to Discover Your Gifts?
  </h2>
  <p class="text-lg sm:text-xl mb-8 max-w-2xl font-graphik">
    Take the Spiritual Gift Test today and embark on a journey of self-discovery
    and purpose.
  </p>
  <div class="flex flex-col md:flex-row gap-4">
    <a
      href={savedName ? "/questionnaire" : "/onboarding"}
      class="bg-white text-primary font-graphik font-semibold px-6 py-3 rounded-md text-lg hover:bg-accent transition"
    >
      {savedName ? "Continue Test" : "Start Test"}
    </a>
    {#if savedName}
      <a
        href="/onboarding"
        on:click={RestartTest}
        class="text-secondary hover:text-white hover:bg-red-400 rounded-md text-sm font-semibold px-6 py-3 transition-colors duration-200 flex items-center gap-1 border border-secondary hover:border-accent"
      >
        Restart Test
        <Restart />
      </a>
    {/if}
  </div>
</div>
