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
    <div class="lb-amount-label">ยอดรวม</div>
  </div>
</div>

<style>
  .lb-row {
    display: flex;
    align-items: center;
    background: rgba(24, 24, 24, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 14px;
    padding: 8px 10px;
    transition: border-color 0.2s;
    backdrop-filter: blur(8px);
  }

  .lb-row:hover { border-color: rgba(255, 255, 255, 0.45); }

  .lb-rank {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #d0d0d0;
    width: 28px;
    text-align: center;
    flex-shrink: 0;
  }

  .lb-info { flex: 1; min-width: 0; }

  .lb-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lb-name {
    font-size: clamp(16px, 4.5vw, 22px);
    font-weight: 500;
    color: #f5f5f5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 6px rgba(0,0,0,0.6);
  }

  .lb-phone {
    font-size: 12px;
    color: #bdbdbd;
    margin-top: 2px;
  }

  .lb-amount {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(20px, 6vw, 30px);
    font-weight: 700;
    color: #ffffff;
    flex-shrink: 0;
    text-shadow: 0 1px 8px rgba(0,0,0,0.5);
  }

  .lb-right { text-align: right; flex-shrink: 0; }

  .lb-amount-label {
    font-size: 10px;
    color: #bdbdbd;
    margin-top: 1px;
    font-family: 'Kanit', sans-serif;
    font-weight: 400;
  }

  .rank-change {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
    animation: fadeOut 3s ease forwards;
  }

  .rank-change.up { color: #4ade80; }
  .rank-change.down { color: #f87171; }

  @keyframes fadeOut {
    0%, 60% { opacity: 1; }
    100% { opacity: 0; }
  }
</style>
