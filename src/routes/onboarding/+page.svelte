<div
  class="relative w-full min-h-screen flex flex-col items-center overflow-hidden py-48"
>
  <div class="text-center px-6 mt-20">
    <h1 class="text-4xl md:text-5xl font-graphik font-bold mb-4">
      Let's Get Started!
    </h1>
    <form class="mt-8" action="/onboarding" method="get">
      <div class="mb-4">
        <label
          for="name"
          class="block text-gray-700 text-sm font-semibold mb-2"
        >
          What's your name?
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter your name"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        class="bg-primary hover:bg-secondary text-white rounded-md text-sm font-semibold px-4 py-2 transition-colors duration-200 shadow-sm"
      >
        Start the Test
      </button>
    </form>
  </div>
</div>
