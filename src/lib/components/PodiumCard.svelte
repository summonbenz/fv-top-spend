<script>
  import { maskPhone } from '$lib/api.js';
  import AnimatedNumber from './AnimatedNumber.svelte';

  /** @type {{ item: object|null, rank: number, rankChange?: number }} */
  let { item, rank, rankChange = 0 } = $props();

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
      <div class="podium-amount"><AnimatedNumber value={item.total} prefix="฿" /></div>
      <div class="podium-amount-label">ยอดรวม</div>
    {:else}
      <div class="podium-amount">—</div>
    {/if}
  </div>
</div>

<style>
  .podium-card {
    border-radius: 20px;
    padding: 20px 24px;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .podium-card:hover { transform: translateX(4px); }

  .rank-1 {
    background: linear-gradient(160deg, rgba(255,210,0,0.14), rgba(255,210,0,0.04));
    border-color: rgba(255,210,0,0.45);
    box-shadow: 0 0 48px rgba(255,210,0,0.25), inset 0 1px 0 rgba(255,210,0,0.25);
  }

  .rank-2 {
    background: linear-gradient(160deg, rgba(255,170,0,0.10), rgba(255,170,0,0.03));
    border-color: rgba(255,170,0,0.28);
    box-shadow: 0 0 32px rgba(255,170,0,0.18);
  }

  .rank-3 {
    background: linear-gradient(160deg, rgba(200,130,0,0.09), rgba(200,130,0,0.02));
    border-color: rgba(200,130,0,0.22);
    box-shadow: 0 0 28px rgba(200,130,0,0.14);
  }

  .podium-empty { opacity: 0.3; }

  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    width: 52px;
  }

  .crown {
    font-size: 24px;
    display: block;
    line-height: 1;
  }

  .rank-medal {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    border-radius: 50%;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    font-weight: 700;
  }

  .rank-1 .rank-medal { background: #ffd700; color: #1a1000; }
  .rank-2 .rank-medal { background: #ffaa00; color: #1a0e00; }
  .rank-3 .rank-medal { background: #c87800; color: #fff8e0; }

  .middle {
    flex: 1;
    min-width: 0;
  }

  .podium-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .podium-name {
    font-size: 22px;
    font-weight: 700;
    color: #fef6d0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .podium-phone {
    font-size: 12px;
    color: #8a7430;
    letter-spacing: 0.5px;
  }

  .right {
    text-align: right;
    flex-shrink: 0;
  }

  .podium-amount {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 30px;
    font-weight: 700;
  }

  .rank-1 .podium-amount { color: #ffd700; }
  .rank-2 .podium-amount { color: #ffaa00; }
  .rank-3 .podium-amount { color: #c87800; }

  .podium-amount-label {
    font-size: 11px;
    color: #8a7430;
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
    .podium-card { padding: 16px; gap: 12px; }
    .podium-name { font-size: 14px; }
    .podium-amount { font-size: 18px; }
    .crown { font-size: 20px; }
  }
</style>
