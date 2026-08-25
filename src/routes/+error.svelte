<div class="w-full min-h-screen flex flex-col justify-center bg-paper px-6">
  <div class="max-w-xl mx-auto w-full">
    <div class="press-in mb-8">
      <svg viewBox="0 0 64 64" class="w-14 h-14" aria-hidden="true">
        <!-- confused little star -->
        <path
          d="M32 8 L38.5 24.5 L56 25.5 L42.5 36.5 L47.5 53.5 L32 44 L16.5 53.5 L21.5 36.5 L8 25.5 L25.5 24.5 Z"
          fill="#ffecc7"
          stroke="#1b1b1b"
          stroke-width="3"
          stroke-linejoin="round"
        />
        <circle cx="27" cy="30" r="1.8" fill="#1b1b1b" />
        <path d="M25 37 C27 35.5 29 35.5 31 37" stroke="#1b1b1b" stroke-width="2.5" stroke-linecap="round" />
      </svg>
    </div>
    <h1 class="press-in press-in-d1 display text-5xl md:text-6xl text-ink mb-5 leading-tight">
      This page wandered off.
    </h1>
    <p class="press-in press-in-d2 text-lg text-ink-faint mb-10 max-w-md leading-relaxed">
      Something went wrong, or the page you are looking for does not exist.
    </p>
    <a href="/" class="press-in press-in-d3 home-btn smallcaps">Go Back Home</a>
  </div>
</div>

<style>
  .home-btn {
    display: inline-flex;
    align-items: center;
    background: var(--color-ink);
    color: var(--color-paper);
    padding: 15px 30px;
    border-radius: 999px;
    text-decoration: none;
    transition: background 0.15s, transform 0.15s;
    font-size: 11px;
  }
  .home-btn:hover {
    background: var(--color-ink-soft);
    transform: translateY(-1px);
  }
</style>
