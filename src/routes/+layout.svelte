<script>
  // Polyfill String.replaceAll for older browsers/environments
  if (!String.prototype.replaceAll) {
    // eslint-disable-next-line no-extend-native
    String.prototype.replaceAll = function(search, replacement) {
      const str = String(this);
      if (search instanceof RegExp) {
        if (!search.global) throw new TypeError('replaceAll must use a global RegExp');
        return str.replace(search, replacement);
      }
      return str.split(String(search)).join(String(replacement));
    };
  }

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
    font-family: 'Kanit', sans-serif;
  }

  :global(.animate-in) {
    animation: fadeInUp 0.4s ease forwards;
  }

  @keyframes -global-fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
