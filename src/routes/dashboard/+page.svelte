<script>
  import { onMount, onDestroy } from 'svelte';
  import { flip } from 'svelte/animate';
  import { quintOut } from 'svelte/easing';
  import PodiumCard from '$lib/components/PodiumCard.svelte';
  import LeaderboardRow from '$lib/components/LeaderboardRow.svelte';
  import { fetchTopSpenders } from '$lib/api.js';

  const REFRESH_INTERVAL = 60000;

  let spenders = $state([]);
  let lastUpdate = $state('—');
  let status = $state('loading'); // 'loading' | 'ok' | 'error' | 'empty'
  let interval;

  const top3 = $derived(spenders.slice(0, 3));
  const rest = $derived(spenders.slice(3));

  async function load() {
    try {
      const data = await fetchTopSpenders();
      if (data.topSpenders?.length > 0) {
        const prevRanks = {};
        spenders.forEach((s, i) => { prevRanks[s.phone] = i + 1; });

        // แนบ rankChange เข้าใน item โดยตรง เพื่อให้ reactive แน่นอน
        spenders = data.topSpenders.map((s, i) => {
          const prev = prevRanks[s.phone];
          const newRank = i + 1;
          return { ...s, rankChange: prev !== undefined ? prev - newRank : 0 };
        });
        status = 'ok';

        // ล้าง indicator หลัง 3 วินาที
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
<div class="sunflower">
  <img src="/sunflower.png" alt="Sunflower" style="width: 100%; max-width: 400px; display: block; margin: 0 auto 40px;" />
</div>
<div class="container">
  <header>
    <img src="/logo.png" alt="FleurVive Logo" style="width: 300px; margin-bottom: 0px;" />
    <h1>Top <span class="title-highlight">Spender</span></h1>
    <!-- <div class="event-badge">Live Ranking</div> -->
  </header>


  <div id="content">
    {#if status === 'loading'}
      <div class="empty-state">
        <div class="icon">⏳</div>
        <p>รอสักครู่ ...</p>
      </div>
    {:else if status === 'empty' || status === 'error'}
      <div class="empty-state">
        <div class="icon">🏆</div>
        <p>{status === 'error' ? '⚠️ ไม่สามารถโหลดข้อมูลได้' : 'ยังไม่มีข้อมูล รอ staff กรอกยอดแรก!'}</p>
      </div>
    {:else}
      <div class="podium-section">
        <div class="podium">
          {#each top3 as item, i (item.phone)}
            <div animate:flip={{ duration: 500, easing: quintOut }}>
              <PodiumCard {item} rank={i + 1} rankChange={item.rankChange ?? 0} />
            </div>
          {/each}
        </div>
      </div>

      {#if rest.length > 0}
        <div class="leaderboard">
          {#each rest as item (item.phone)}
            <div animate:flip={{ duration: 400, easing: quintOut }}>
              <LeaderboardRow {item} rankChange={item.rankChange ?? 0} />
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
  <div class="info">
  <span class="text-underline">รางวัลสำหรับ Top Spenders</span><br/>
    อันดับ 1 Group Canvas (Size : A2)<br/>
    อันดับ 2 Sunflower Chibi Lamp (พร้อมลายเซ็น)<br/>
    อันดับ 3 Sunflower Hand-Painted Tote Bag (พร้อมลายเซ็น)<br/>
    ผู้ที่มียอดซื้อสินค้าของ FleurVive สูงที่สุด 3 อันดับ (รวมค่าบัตรเข้างาน)<br/>
    ประกาศผลหลังกิจกรรม Lucky Draw เวลา 21.00-21.20 น.
  </div>
</div>

<style>
  :global(body) {
    background: #100c00 url('/bg.png') center center / cover no-repeat fixed;
    color: #fef6d0;
    height: 100vh;
    overflow: hidden;
  }

  .bg-overlay { display: none; }

  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
  }

  .orb-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(255,200,0,0.15), transparent 70%);
    top: -120px; left: -120px;
  }

  .orb-2 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(255,140,0,0.12), transparent 70%);
    bottom: -80px; right: -80px;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 820px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }

  header {
    text-align: center;
    margin-bottom: 56px;
  }

  .event-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 200, 0, 0.12);
    border: 1px solid rgba(255, 200, 0, 0.35);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #ffc800;
    margin-bottom: 20px;
  }

  .event-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: #ffc800;
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
    background: linear-gradient(135deg, #ffd700, #ff8c00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 15px;
    color: #8a7430;
  }

  .podium-section { margin-bottom: 40px; }

  .section-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #8a7430;
    margin-bottom: 20px;
    text-align: center;
  }

  .podium {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .leaderboard {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .outer-status-bar {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .status-bar {
    display: inline-flex;
    padding: 6px 16px;
    align-items: center;
    gap: 12px;
    margin-top: 40px;
    font-size: 13px;
    color: #ffc800;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 200, 0, 0.35);
    border-radius: 100px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .status-dot {
    width: 8px; height: 8px;
    background: #ffc800;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #8a7430;
  }

  .info{
    text-align:center;
    margin-top: 20px;
    text-shadow: 0 0 12px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6);
  }
  .text-underline {
    text-decoration: underline;
    text-decoration-color: rgba(255, 180, 0, 0.5);
    text-underline-offset: 4px;
  }

  .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state p { font-size: 16px; }

  .sunflower{
    position: absolute;
    top: 0;
    right: 0;
    max-width: 250px;
  }

  @media (max-width: 480px) {
    .podium { gap: 8px; }
  }
</style>
