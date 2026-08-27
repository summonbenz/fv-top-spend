<script>
  import { onMount, onDestroy } from 'svelte';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import PodiumCard from '$lib/components/PodiumCard.svelte';
  import LeaderboardRow from '$lib/components/LeaderboardRow.svelte';
  import { fetchTopSpenders } from '$lib/api.js';

  const REFRESH_INTERVAL = 60000;

  const rankingList = Math.max(1, Number(__RANKING_LIST__) || 10);
  const highlightStart = Math.max(1, Number(__HIGHLIGHT_START__) || 3);
  const podiumCount = Math.min(rankingList, highlightStart);

  let spenders = $state([]);
  let lastUpdate = $state('—');
  let status = $state('loading'); // 'loading' | 'ok' | 'error' | 'empty'
  let paused = $state(false);
  let maskingPrefix = $state(false);
  let interval;

  const visibleSpenders = $derived(spenders.slice(0, rankingList));
  const top3 = $derived(visibleSpenders.slice(0, podiumCount));
  const rest = $derived(visibleSpenders.slice(podiumCount));

  async function load() {
    try {
      const data = await fetchTopSpenders();

      paused = data.pause === true || String(data.pause).toLowerCase() === 'true';
      maskingPrefix = data.maskingPrefix === true || String(data.maskingPrefix).toLowerCase() === 'true';

      if (paused) {
        status = 'ok';
        lastUpdate = `อัปเดทล่าสุด ${new Date().toLocaleTimeString('th-TH')}`;
        return;
      }

      if (data.topSpenders?.length > 0) {
        const prevRanks = {};
        spenders.forEach((s, i) => { prevRanks[s.phone] = i + 1; });

        spenders = data.topSpenders.slice(0, rankingList).map((s, i) => {
          const prev = prevRanks[s.phone];
          const newRank = i + 1;
          return { ...s, rankChange: prev !== undefined ? prev - newRank : 0 };
        });
        status = 'ok';

        setTimeout(() => {
          spenders = spenders.map(s => ({ ...s, rankChange: 0 }));
        }, 3000);
      } else {
        spenders = [];
        status = 'empty';
      }
      lastUpdate = `อัปเดทล่าสุด ${new Date().toLocaleTimeString('th-TH')}`;
    } catch {
      status = status === 'loading' ? 'error' : status;
      lastUpdate = '⚠️ ไม่สามารถเชื่อมต่อได้';
    }
  }

  onMount(() => {
    load();
    interval = setInterval(load, REFRESH_INTERVAL);
  });

  onDestroy(() => clearInterval(interval));
</script>

<svelte:head>
  <title>Top Spender Dashboard</title>
</svelte:head>

    <div class="bg-overlay"></div>
<div class="bg-orb orb-1"></div>
<div class="bg-orb orb-2"></div>
<div class="fleurvive">
  <img src="/logo.png" alt="Sunflower" class="fleurvive-img" />
</div>
<div class="container">
  <header>
    <img src="/header.png" alt="header Logo" class="logo-img" />
    <div class="heading-text">
      <span class="title-highlight">Top Spender</span>
    </div>
    <!-- <div class="event-badge">Live Ranking</div> -->
  </header>


  <div id="content">
    {#if status === 'loading'}
      <div class="empty-state">
        <div class="spinner" aria-label="กำลังโหลด" role="status"></div>
        <p>รอสักครู่ ...</p>
      </div>
    {:else if status === 'empty' || status === 'error'}
      <div class="empty-state">
        <div class="icon">🏆</div>
        <p>{status === 'error' ? '⚠️ ไม่สามารถโหลดข้อมูลได้' : 'ยังไม่มีข้อมูล รอ staff กรอกยอดแรก!'}</p>
      </div>
    {:else if paused}
      <div class="paused-state">
        <div class="paused-icon">🔒</div>
        <p class="paused-text">ปิดการแสดงยอดแล้ว<br/>รอประกาศผล</p>
      </div>
    {:else}
      <div class="podium-section">
        <div class="podium">
          {#each top3 as item, i (item.phone)}
            <div animate:flip={{ duration: 500, easing: quintOut }}>
              <PodiumCard {item} rank={i + 1} rankChange={item.rankChange ?? 0} {maskingPrefix} />
            </div>
          {/each}
        </div>
      </div>

      {#if rest.length > 0}
        <div class="leaderboard">
          {#each rest as item (item.phone)}
            <div animate:flip={{ duration: 400, easing: quintOut }}>
              <LeaderboardRow {item} rankChange={item.rankChange ?? 0} {maskingPrefix} />
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>
  <div class="outer-status-bar">
    <div class="status-bar ">
      <span class="status-dot"></span>
      <span>{lastUpdate}</span>
    </div>
  </div>
  <div id="marquee">
    <div class="marquee-track">
      <span class="text-underline">รางวัลสำหรับ Top Spenders</span>
      Natzu Drapery (Size : A2)
      ผู้ที่มียอดซื้อสินค้าของ FleurVive สูงที่สุด (รวมค่าบัตรเข้างาน)
      ประกาศผลหลังกิจกรรม Lucky Draw เวลา 21.00 - 21.20 น.
    </div>
  </div>
 
</div>

<style>
  :global(html, body) {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  :global(body) {
    background: #050505 url('/bg.png') center center / cover no-repeat fixed;
    color: #f5f5f5;
    min-height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
  }

  .bg-overlay { display: none; }

  #content{
    display: flex;
    flex-direction: column;
  }

  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
  }

  .orb-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%);
    top: -120px; left: -120px;
  }

  .orb-2 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%);
    bottom: -80px; right: -80px;
  }

  .container {
    position: relative;
    z-index: 1;
    width: min(100%, 820px);
    height: 100vh;
    margin: 0 auto;
    padding: clamp(12px, 2vh, 24px) clamp(16px, 2.6vw, 28px) 78px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .fleurvive-img {
    display: block;
    width: 100%; 
    height: auto;

  }

  .logo-img {
    display: block;
    width: 20vw;
    height: auto;
    margin: 0 auto;
  }

  header {
    text-align: center;
    margin-bottom: clamp(12px, 2vh, 32px);
    flex-shrink: 0;
  }

  .heading-text{
    font-size: 2vw;
  }

  .event-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #ffffff;
    margin-bottom: 20px;
  }

  .event-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: #ffffff;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  header h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(32px, 6vw, 52px);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 12px;
    text-shadow: 0 12px 12px rgba(0,0,0,0.1);
  }

  .title-highlight {
    /* background: linear-gradient(135deg, #ffffff, #bdbdbd); */
    /* -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; */
    /* background-clip: text; */
    color: #ffffffed;
    text-shadow: 2px 2px 8px rgba(0,0,0,0.81);
  }

  .subtitle {
    font-size: 15px;
    color: #bdbdbd;
  }

  #content {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    align-items: stretch;
    justify-content: center;
    overflow: hidden;
  }

  .podium-section { margin-bottom: clamp(10px, 1.8vh, 24px); }

  .section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #bdbdbd;
    margin-bottom: 20px;
    text-align: center;
  }

  .podium {
    display: grid;
    
    width: 100%;
  }

  .leaderboard {
    display: flex;
    flex-direction: column;
    gap: clamp(6px, 0.9vh, 8px);
    width: 100%;
  }
  .outer-status-bar {
    display: flex;
    justify-content: center;
    margin-top: clamp(8px, 1.6vh, 18px);
    flex-shrink: 0;
  }

  .status-bar {
    display: inline-flex;
    padding: 6px 16px;
    align-items: center;
    gap: 12px;
    margin-top: 0;
    font-size: 13px;
    color: #f5f5f5;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 100px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .status-dot {
    width: 8px; height: 8px;
    background: #ffffff;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #d0d0d0;
  }

  .paused-state {
    text-align: center;
    padding: 60px 20px;
  }

  .paused-icon { font-size: 48px; margin-bottom: 16px; }

  .paused-text {
    font-size: clamp(18px, 5vw, 26px);
    font-weight: 600;
    color: #ffffff;
    line-height: 1.6;
    text-shadow: 0 0 20px rgba(255,255,255,0.18), 0 2px 8px rgba(0,0,0,0.6);
  }

  .info{
    text-align:center;
    margin-top: 20px;
    text-shadow: 0 0 12px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6);
  }
  .text-underline {
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.5);
    text-underline-offset: 4px;
  }

  .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state p { font-size: 16px; }

  #marquee{
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-size: clamp(0.8rem, 1.6vw, 1.2rem);
    padding: 8px 10px;
    margin-top: auto;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 2;
    height: clamp(32px, 4vh, 52px);
    line-height: 1.2;
  }

  .marquee-track {
    display: inline-block;
    min-width: 100%;
    padding-left: 100%;
    animation: marquee-scroll 22s linear infinite;
  }

  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }

  .spinner {
    width: 42px;
    height: 42px;
    margin: 0 auto 22px;
    border: 4px solid rgba(255, 255, 255, 0.25);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fleurvive {
    position: fixed;
    top: 0;
    right: 0; 
    width: 8vw;
    overflow: hidden;
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 480px) {
    .podium { gap: 8px; }
    .container { padding-bottom: 70px; }
    #marquee { font-size: 0.76rem; }
  }
</style>
