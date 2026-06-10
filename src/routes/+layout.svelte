<script>
  let { children } = $props();
</script>

{@render children()}

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    font-family: 'Sarabun', sans-serif;
  }

  :global(.animate-in) {
    animation: fadeInUp 0.4s ease forwards;
  }

  @keyframes -global-fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
