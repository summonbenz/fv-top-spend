<script>
  import { maskPhone } from '$lib/api.js';
  import AnimatedNumber from './AnimatedNumber.svelte';


  /** @type {{ item: object|null, rank: number, rankChange?: number }} */
  let { item, rank, rankChange = 0, maskingPrefix = false } = $props();

  const crowns = { 1: '👑', 2: '🥈', 3: '🥉' };
  const rankClass = $derived(`rank-${rank}`);
</script>

<div class="podium-card {rankClass} animate-in" class:podium-empty={!item}>
  <div class="left">
    <span class="crown">{crowns[rank]}</span>
    <div class="rank-medal">{rank}</div>
  </div>
  <div class="middle">
    {#if item}
      <div class="podium-name-row">
        <span class="podium-name">{item.name}</span>
        {#if rankChange !== 0}
          <span class="rank-change" class:up={rankChange > 0} class:down={rankChange < 0}>
            {rankChange > 0 ? '▲' : '▼'}{Math.abs(rankChange)}
          </span>
        {/if}
      </div>
    {:else}
      <div class="podium-name">ว่าง</div>
      <div class="podium-phone">ยังไม่มีผู้เข้าร่วม</div>
    {/if}
  </div>
  <div class="right">
    {#if item}
      <div class="podium-amount"><AnimatedNumber value={item.total} prefix="฿" storageKey={item.phone} mask={maskingPrefix} /></div>
      <!-- <div class="podium-amount-label">ยอดรวม</div> -->
    {:else}
      <div class="podium-amount">—</div>
    {/if}
  </div>
</div>

<style>
  .podium-card {
    border-radius: 20px;
    padding: 10px 12px;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    gap: 16px;
    --gap: 16px;
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }

  /* Fallback for browsers without flex gap support (e.g. Android WebView 83) */
  .podium-card > * + * { margin-left: var(--gap); }
  @supports (gap: 1px) {
    .podium-card > * + * { margin-left: 0; }
  }

  .podium-card:hover { transform: translateX(4px); }

  .rank-1 {
    background: linear-gradient(160deg, rgba(30,30,30,0.92), rgba(12,12,12,0.96));
    border-color: rgba(255,255,255,0.60);
    box-shadow: 0 0 24px 6px rgba(255,255,255,0.18), 0 0 60px 10px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.18);
  }

  .rank-2 {
    background: linear-gradient(160deg, rgba(24,24,24,0.90), rgba(10,10,10,0.95));
    border-color: rgba(255,255,255,0.45);
    box-shadow: 0 0 20px 4px rgba(255,255,255,0.10), 0 0 50px 8px rgba(255,255,255,0.04);
  }

  .rank-3 {
    background: linear-gradient(160deg, rgba(20,20,20,0.90), rgba(8,8,8,0.94));
    border-color: rgba(255,255,255,0.32);
    box-shadow: 0 0 18px 4px rgba(255,255,255,0.06), 0 0 44px 8px rgba(255,255,255,0.03);
  }

  .podium-empty { opacity: 0.3; }

  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    --gap-v: 4px;
    flex-shrink: 0;
    width: 52px;
  }

  .left > * + * { margin-top: var(--gap-v); }
  @supports (gap: 1px) {
    .left > * + * { margin-top: 0; }
  }

  .crown {
    font-size: 24px;
    display: block;
    line-height: 1;
  }

  .rank-medal {
    width: 32px;
    height: 32px;
    text-align: center;
    border-radius: 50%;
    line-height: 32px;
    /* background-image: url('/circle.png'); */
    /* background-color: #000; */
  }

  .rank-1 .rank-medal { background: #ffffff; color: #111111; }
  .rank-2 .rank-medal { background: #d9d9d9; color: #111111; }
  .rank-3 .rank-medal { background: #9e9e9e; color: #111111; }

  .middle {
    flex: 1;
    min-width: 0;
  }

  .podium-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    --gap: 8px;
  }

  .podium-name-row > * + * { margin-left: var(--gap); }
  @supports (gap: 1px) {
    .podium-name-row > * + * { margin-left: 0; }
  }

  .podium-name {
    font-size: clamp(16px, 4.5vw, 22px);
    font-weight: 500;
    color: #f5f5f5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 6px rgba(0,0,0,0.6);
  }

  .podium-phone {
    font-size: 12px;
    color: #bdbdbd;
    letter-spacing: 0.5px;
  }

  .right {
    text-align: right;
    flex-shrink: 0;
  }

  .podium-amount {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(20px, 6vw, 30px);
    font-weight: 700;
    text-shadow: 0 1px 8px rgba(0,0,0,0.5);
  }

  .rank-1 .podium-amount { color: #ffffff; }
  .rank-2 .podium-amount { color: #e0e0e0; }
  .rank-3 .podium-amount { color: #cfcfcf; }

  .podium-amount-label {
    font-size: 11px;
    color: #bdbdbd;
    margin-top: 2px;
  }

  .rank-change {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
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

  @media (max-width: 480px) {
    .podium-card { padding: 16px; gap: 12px; --gap: 12px; }
    .podium-card > * + * { margin-left: var(--gap); }
    @supports (gap: 1px) {
      .podium-card > * + * { margin-left: 0; }
    }
    .crown { font-size: 20px; }
  }
</style>
