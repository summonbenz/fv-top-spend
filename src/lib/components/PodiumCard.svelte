<script>
  import { maskPhone } from '$lib/api.js';
  import AnimatedNumber from './AnimatedNumber.svelte';

  /** @type {{ item: object|null, rank: number }} */
  let { item, rank } = $props();

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
      <div class="podium-name">{maskPhone(item.phone)}</div>
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
    background: linear-gradient(160deg, rgba(245,200,66,0.1), rgba(245,200,66,0.03));
    border-color: rgba(245,200,66,0.3);
    box-shadow: 0 0 40px rgba(245,200,66,0.25), inset 0 1px 0 rgba(245,200,66,0.2);
  }

  .rank-2 {
    background: linear-gradient(160deg, rgba(192,200,216,0.08), rgba(192,200,216,0.02));
    border-color: rgba(192,200,216,0.2);
    box-shadow: 0 0 30px rgba(192,200,216,0.15);
  }

  .rank-3 {
    background: linear-gradient(160deg, rgba(224,128,74,0.08), rgba(224,128,74,0.02));
    border-color: rgba(224,128,74,0.2);
    box-shadow: 0 0 30px rgba(224,128,74,0.15);
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

  .rank-1 .rank-medal { background: #f5c842; color: #1a1400; }
  .rank-2 .rank-medal { background: #c0c8d8; color: #151a20; }
  .rank-3 .rank-medal { background: #e0804a; color: #1a0d05; }

  .middle {
    flex: 1;
    min-width: 0;
  }

  .podium-name {
    font-size: 16px;
    font-weight: 700;
    color: #eeeef8;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .podium-phone {
    font-size: 12px;
    color: #55556a;
    letter-spacing: 0.5px;
  }

  .right {
    text-align: right;
    flex-shrink: 0;
  }

  .podium-amount {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 22px;
    font-weight: 700;
  }

  .rank-1 .podium-amount { color: #f5c842; }
  .rank-2 .podium-amount { color: #c0c8d8; }
  .rank-3 .podium-amount { color: #e0804a; }

  .podium-amount-label {
    font-size: 11px;
    color: #55556a;
    margin-top: 2px;
  }

  @media (max-width: 480px) {
    .podium-card { padding: 16px; gap: 12px; }
    .podium-name { font-size: 14px; }
    .podium-amount { font-size: 18px; }
    .crown { font-size: 20px; }
  }
</style>
