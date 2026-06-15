<script>
  import { formatAmount } from '$lib/api.js';

  let { value, prefix = '', storageKey = '', mask = false } = $props();

  function getSaved() {
    if (!storageKey) return 0;
    const v = localStorage.getItem('animnum_' + storageKey);
    return v !== null ? Number(v) : 0;
  }

  // แยก formatted string เป็น maskedPrefix + suffixTemplate หลังจาก 2 digits แรก
  function splitMasked(n) {
    const formatted = formatAmount(n);
    let digitCount = 0, splitIndex = formatted.length;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        digitCount++;
        if (digitCount === 2) { splitIndex = i + 1; break; }
      }
    }
    const maskedPrefix = formatted.slice(0, splitIndex).replace(/\d/g, 'x');
    const suffixTemplate = formatted.slice(splitIndex); // เช่น ",345" หรือ "45"
    const suffixDigitCount = (suffixTemplate.match(/\d/g) || []).length;
    const divisor = Math.pow(10, suffixDigitCount);
    return { maskedPrefix, suffixTemplate, suffixDigitCount, divisor };
  }

  // แทน digit ใน template ด้วย digits จาก n (รักษา comma/structure)
  function formatSuffix(n, template, digitCount) {
    const digits = String(Math.round(Math.abs(n))).padStart(digitCount, '0');
    let di = 0;
    return template.replace(/\d/g, () => digits[di++] ?? '0');
  }

  let fromValue = getSaved();
  let displayText = $state(prefix + formatAmount(fromValue));

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  $effect(() => {
    void mask;
    displayText = prefix + (mask
      ? (() => { const { maskedPrefix, suffixTemplate, suffixDigitCount, divisor } = splitMasked(fromValue); return maskedPrefix + formatSuffix(fromValue % divisor, suffixTemplate, suffixDigitCount); })()
      : formatAmount(fromValue));
  });

  $effect(() => {
    const to = value;
    const from = fromValue;
    fromValue = to;

    if (storageKey) localStorage.setItem('animnum_' + storageKey, String(to));
    if (from === to) return;

    const duration = 1000;
    const startTime = performance.now();

    if (mask) {
      const { maskedPrefix, suffixTemplate, suffixDigitCount, divisor } = splitMasked(to);
      const toSuffix = to % divisor;
      const fromSuffix = from % divisor;
      const diff = toSuffix - fromSuffix;

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = fromSuffix + diff * easeOutQuart(progress);
        displayText = prefix + maskedPrefix + formatSuffix(current, suffixTemplate, suffixDigitCount);
        if (progress < 1) requestAnimationFrame(step);
        else displayText = prefix + maskedPrefix + formatSuffix(toSuffix, suffixTemplate, suffixDigitCount);
      }
      requestAnimationFrame(step);
    } else {
      const diff = to - from;
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        displayText = prefix + formatAmount(from + diff * easeOutQuart(progress));
        if (progress < 1) requestAnimationFrame(step);
        else displayText = prefix + formatAmount(to);
      }
      requestAnimationFrame(step);
    }
  });
</script>

{displayText}
