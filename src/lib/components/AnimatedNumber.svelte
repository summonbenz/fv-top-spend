<script>
  import { formatAmount } from '$lib/api.js';

  let { value, prefix = '' } = $props();

  let displayText = $state(prefix + formatAmount(value));
  let fromValue = value;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  $effect(() => {
    const to = value;
    const from = fromValue;
    fromValue = to;

    if (from === to) return;

    const duration = from === 0 ? 1200 : 800;
    const startTime = performance.now();
    const diff = to - from;

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      displayText = prefix + formatAmount(from + diff * easeOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
      else displayText = prefix + formatAmount(to);
    }

    requestAnimationFrame(step);
  });
</script>

{displayText}
