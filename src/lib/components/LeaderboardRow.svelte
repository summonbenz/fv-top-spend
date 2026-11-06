<script>
  import { maskPhone } from '$lib/api.js';
  import AnimatedNumber from './AnimatedNumber.svelte';

  /** @type {{ item: object, rankChange?: number }} */
  let { item, rankChange = 0, maskingPrefix = false } = $props();
</script>

<div class="lb-row animate-in">
  <div class="lb-rank">{item.rank}</div>
  <div class="lb-info">
    <div class="lb-name-row">
      <span class="lb-name">{item.name}</span>
      {#if rankChange !== 0}
        <span class="rank-change" class:up={rankChange > 0} class:down={rankChange < 0}>
          {rankChange > 0 ? '▲' : '▼'}{Math.abs(rankChange)}
        </span>
      {/if}
    </div>
  </div>
  <div class="lb-right">
    <div class="lb-amount"><AnimatedNumber value={item.total} prefix="฿" storageKey={item.phone} mask={maskingPrefix} /></div>
    <!-- <div class="lb-amount-label">ยอดรวม</div> -->
  </div>
</div>

<style>
  .lb-row {
    display: flex;
    align-items: center;
    background: rgba(255, 252, 255, 0.86);
    border: 1px solid rgba(178, 146, 207, 0.42);
    border-radius: 20px;
    padding: 8px 10px;
    transition: border-color 0.2s;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    box-shadow: 0 5px 16px rgba(107, 73, 137, 0.12);
  }

  .lb-row:hover {
    border-color: rgba(218, 119, 169, 0.72);
    box-shadow: 0 7px 20px rgba(218, 112, 166, 0.2);
  }

  .lb-rank {
    font-family: 'Fredoka', 'Mali', sans-serif;
    font-size: calc(15px * var(--font-scale, 1));
    font-weight: 600;
    color: #8a6ca4;
    width: 28px;
    text-align: center;
    flex-shrink: 0;
  }

  .lb-info { flex: 1; min-width: 0; }

  .lb-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    --gap: 8px;
  }

  .lb-name-row > * + * { margin-left: var(--gap); }
  @supports (gap: 1px) {
    .lb-name-row > * + * { margin-left: 0; }
  }

  .lb-name {
    font-size: calc(clamp(16px, 4.5vw, 22px) * var(--font-scale, 1));
    font-weight: 500;
    color: #513c68;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 8px rgba(255,255,255,0.9);
  }

  .lb-phone {
    font-size: 12px;
    color: #806b91;
    margin-top: 2px;
  }

  .lb-amount {
    font-family: 'Fredoka', 'Mali', sans-serif;
    font-size: calc(clamp(20px, 6vw, 30px) * var(--font-scale, 1));
    font-weight: 600;
    color: #7653a6;
    flex-shrink: 0;
    text-shadow: 0 1px 8px rgba(255,255,255,0.9);
  }

  .lb-right { text-align: right; flex-shrink: 0; }

  .lb-amount-label {
    font-size: 10px;
    color: #806b91;
    margin-top: 1px;
    font-family: 'Mali', sans-serif;
    font-weight: 400;
  }

  .rank-change {
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
    animation: fadeOut 3s ease forwards;
  }

  .rank-change.up { color: #34855b; }
  .rank-change.down { color: #d95672; }

  @keyframes fadeOut {
    0%, 60% { opacity: 1; }
    100% { opacity: 0; }
  }
</style>
