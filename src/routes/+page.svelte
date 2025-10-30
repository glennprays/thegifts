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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V17H6C4.89543 17 4 17.8954 4 19ZM4 19C4 20.1046 4.89543 21 6 21H20M9 7H15M9 11H15M19 17V21"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M7 20h10" />
          <path d="M10 20c5.5-2.5.8-6.4 3-10" />
          <path
            d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"
          />
          <path
            d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"
          />
        </svg>
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <path
            d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z"
          />
        </svg>
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
  <h2 class="text-3xl sm:text-4xl md:text-5xl font-graphik font-semibold mb-4">
    Ready to Discover Your Gifts?
  </h2>
  <p class="text-lg sm:text-xl mb-8 max-w-2xl font-graphik">
    Take the Spiritual Gift Test today and embark on a journey of self-discovery
    and purpose.
  </p>
  <a
    href="/onboarding"
    class="bg-white text-primary font-graphik font-semibold px-6 py-3 rounded-md text-lg hover:bg-accent transition"
  >
    Start the Test
  </a>
</div>
