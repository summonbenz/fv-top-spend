<script>
  import { maskPhone } from '$lib/api.js';
  import AnimatedNumber from './AnimatedNumber.svelte';


  /** @type {{ item: object|null, rank: number, rankChange?: number }} */
  let { item, rank, rankChange = 0, maskingPrefix = false } = $props();

  const crowns = {
    1: { src: '/icons/canvas.svg', alt: 'Canvas' },
    2: { src: '/icons/blanket.svg', alt: 'Blanket' },
    3: { src: '/icons/pillow.svg', alt: 'Pillow' }
  };
  const rankClass = $derived(`rank-${rank}`);
</script>

<div class="podium-card {rankClass} animate-in" class:podium-empty={!item}>
  <div class="left">
    {#if crowns[rank]}
      <img class="crown" src={crowns[rank].src} alt={crowns[rank].alt} />
    {/if}
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
    min-height: var(--podium-height, 0px);
    box-sizing: border-box;
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

  .podium-card .podium-amount{
        font-weight: 600;
  }

  /* Fallback for browsers without flex gap support (e.g. Android WebView 83) */
  .podium-card > * + * { margin-left: var(--gap); }
  @supports (gap: 1px) {
    .podium-card > * + * { margin-left: 0; }
  }

  .podium-card:hover { transform: translateX(4px); }

  .rank-1 {
    background: linear-gradient(145deg, rgba(255, 244, 249, 0.96), rgba(255, 255, 255, 0.9));
    border-color: rgba(236, 132, 180, 0.62);
    box-shadow: 0 8px 24px rgba(218, 112, 166, 0.2), inset 0 1px 0 rgba(255,255,255,0.92);
  }

  .rank-2 {
    background: linear-gradient(145deg, rgba(247, 243, 255, 0.96), rgba(255, 255, 255, 0.9));
    border-color: rgba(163, 139, 218, 0.58);
    box-shadow: 0 8px 22px rgba(133, 103, 191, 0.16), inset 0 1px 0 rgba(255,255,255,0.92);
  }

  .rank-3 {
    background: linear-gradient(145deg, rgba(239, 249, 255, 0.96), rgba(255, 255, 255, 0.9));
    border-color: rgba(126, 190, 220, 0.62);
    box-shadow: 0 8px 22px rgba(93, 166, 199, 0.16), inset 0 1px 0 rgba(255,255,255,0.92);
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
    width: 40px;
    height: 40px;
    display: block;
  }

  .rank-medal {
    width: 32px;
    height: 32px;
    display: block;
    background-image: url('/circle.png');
    background-size: cover;
    background-position: center;
    color: #604677;
    text-align: center;
    line-height: 32px;
    font-family: 'Fredoka', 'Mali', sans-serif;
    font-weight: 600;
    /* background-image: url('/circle.png'); */
    /* background-color: #000; */
  }

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
    font-size: calc(clamp(16px, 4.5vw, 22px) * var(--font-scale, 1));
    font-weight: 500;
    color: #513c68;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 8px rgba(255,255,255,0.9);
  }

  .podium-phone {
    font-size: 12px;
    color: #806b91;
    letter-spacing: 0.5px;
  }

  .right {
    text-align: right;
    flex-shrink: 0;
  }

  .podium-amount {
    font-family: 'Fredoka', 'Mali', sans-serif;
    font-size: calc(clamp(20px, 6vw, 30px) * var(--font-scale, 1));
    font-weight: 700;
    text-shadow: 0 1px 8px rgba(255,255,255,0.9);
  }

  .rank-1 .podium-amount { color: #c5538c; }
  .rank-2 .podium-amount { color: #7858ad; }
  .rank-3 .podium-amount { color: #4387a5; }

  .podium-amount-label {
    font-size: 11px;
    color: #806b91;
    margin-top: 2px;
  }

  .rank-change {
    font-size: 13px;
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

  @media (max-width: 480px) {
    .podium-card { padding: 16px; gap: 12px; --gap: 12px; }
    .podium-card > * + * { margin-left: var(--gap); }
    @supports (gap: 1px) {
      .podium-card > * + * { margin-left: 0; }
    }
    .crown { width: 32px; height: 32px; }
  }
</style>
