<script>
  import { maskPhone } from '$lib/api.js';
  import AnimatedNumber from './AnimatedNumber.svelte';

  /** @type {{ item: object, rankChange?: number }} */
  let { item, rankChange = 0 } = $props();
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
    <div class="lb-amount"><AnimatedNumber value={item.total} prefix="฿" /></div>
    <div class="lb-amount-label">ยอดรวม</div>
  </div>
</div>

<style>
  .lb-row {
    display: flex;
    align-items: center;
    background: rgba(255, 200, 0, 0.04);
    border: 1px solid rgba(255, 180, 0, 0.15);
    border-radius: 14px;
    padding: 16px 20px;
    gap: 16px;
    transition: border-color 0.2s;
  }

  .lb-row:hover { border-color: rgba(255, 180, 0, 0.35); }

  .lb-rank {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #8a7430;
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
    font-size: 20px;
    font-weight: 600;
    color: #fef6d0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lb-phone {
    font-size: 12px;
    color: #8a7430;
    margin-top: 2px;
  }

  .lb-amount {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #ffc800;
    flex-shrink: 0;
  }

  .lb-right { text-align: right; flex-shrink: 0; }

  .lb-amount-label {
    font-size: 10px;
    color: #8a7430;
    margin-top: 1px;
    font-family: 'Sarabun', sans-serif;
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
