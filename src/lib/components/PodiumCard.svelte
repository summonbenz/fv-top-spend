<script>
  import { maskPhone } from '$lib/api.js';
  import AnimatedNumber from './AnimatedNumber.svelte';

  /** @type {{ item: object|null, rank: number }} */
  let { item, rank } = $props();

  const crowns = { 1: '👑', 2: '🥈', 3: '🥉' };
  const rankClass = $derived(`rank-${rank}`);
</script>

<div class="podium-card {rankClass} animate-in" class:podium-empty={!item}>
  <span class="crown">{crowns[rank]}</span>
  <div class="rank-medal">{rank}</div>
  {#if item}
    <div class="podium-name">{item.name}</div>
    <div class="podium-phone">{maskPhone(item.phone)}</div>
    <div class="podium-amount"><AnimatedNumber value={item.total} prefix="฿" /></div>
    <div class="podium-amount-label">ยอดรวม</div>
  {:else}
    <div class="podium-name">ว่าง</div>
    <div class="podium-phone">ยังไม่มีผู้เข้าร่วม</div>
    <div class="podium-amount">—</div>
  {/if}
</div>

<style>
  .podium-card {
    border-radius: 20px;
    padding: 28px 16px 24px;
    text-align: center;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease;
  }

  .podium-card:hover { transform: translateY(-4px); }

  .rank-1 {
    background: linear-gradient(160deg, rgba(245,200,66,0.1), rgba(245,200,66,0.03));
    border-color: rgba(245,200,66,0.3);
    box-shadow: 0 0 40px rgba(245,200,66,0.25), inset 0 1px 0 rgba(245,200,66,0.2);
    padding-top: 36px;
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

  .crown {
    font-size: 28px;
    margin-bottom: 8px;
    display: block;
  }

  .rank-medal {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px; height: 36px;
    border-radius: 50%;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .rank-1 .rank-medal { background: #f5c842; color: #1a1400; }
  .rank-2 .rank-medal { background: #c0c8d8; color: #151a20; }
  .rank-3 .rank-medal { background: #e0804a; color: #1a0d05; }

  .podium-name {
    font-size: 16px;
    font-weight: 700;
    color: #eeeef8;
    margin-bottom: 4px;
    word-break: break-all;
  }

  .podium-phone {
    font-size: 12px;
    color: #55556a;
    margin-bottom: 14px;
    letter-spacing: 0.5px;
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
    .podium-card { padding: 20px 10px 18px; border-radius: 14px; }
    .podium-name { font-size: 13px; }
    .podium-amount { font-size: 17px; }
    .crown { font-size: 22px; }
  }
</style>
