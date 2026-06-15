<script>
  import { formatAmount } from '$lib/api.js';

  let { value, prefix = '', storageKey = '' } = $props();

  function getSaved() {
    if (!storageKey) return 0;
    const v = localStorage.getItem('animnum_' + storageKey);
    return v !== null ? Number(v) : 0;
  }

  let fromValue = getSaved();
  let displayText = $state(prefix + formatAmount(fromValue));

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  $effect(() => {
    const to = value;
    const from = fromValue;
    fromValue = to;

    if (storageKey) localStorage.setItem('animnum_' + storageKey, String(to));
    if (from === to) return;

    const duration = 1000;
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
