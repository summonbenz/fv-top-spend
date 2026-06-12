<script>
  import { onMount, onDestroy } from 'svelte';
  import PodiumCard from '$lib/components/PodiumCard.svelte';
  import LeaderboardRow from '$lib/components/LeaderboardRow.svelte';
  import { fetchTopSpenders } from '$lib/api.js';

  const REFRESH_INTERVAL = 60000;

  let spenders = $state([]);
  let lastUpdate = $state('—');
  let status = $state('loading'); // 'loading' | 'ok' | 'error' | 'empty'
  let interval;

  const top3 = $derived([spenders[0] ?? null, spenders[1] ?? null, spenders[2] ?? null]);
  const rest = $derived(spenders.slice(3));

  async function load() {
    try {
      const data = await fetchTopSpenders();
      if (data.topSpenders?.length > 0) {
        spenders = data.topSpenders;
        status = 'ok';
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

<div class="bg-orb orb-1"></div>
<div class="bg-orb orb-2"></div>

<div class="container">
  <header>
    <h1>FleurVive<br/>Top <span class="title-highlight">Spender</span></h1>
    <div class="event-badge">Live Ranking</div>
  </header>

  <div id="content">
    {#if status === 'loading'}
      <div class="empty-state">
        <div class="icon">⏳</div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    {:else if status === 'empty' || status === 'error'}
      <div class="empty-state">
        <div class="icon">🏆</div>
        <p>{status === 'error' ? '⚠️ ไม่สามารถโหลดข้อมูลได้' : 'ยังไม่มีข้อมูล รอ staff กรอกยอดแรก!'}</p>
      </div>
    {:else}
      <div class="podium-section">
        <div class="podium">
          <PodiumCard item={top3[0]} rank={1} />
          <PodiumCard item={top3[1]} rank={2} />
          <PodiumCard item={top3[2]} rank={3} />
        </div>
      </div>

      {#if rest.length > 0}
        <div class="leaderboard">
          {#each rest as item (item.phone)}
            <LeaderboardRow {item} />
          {/each}
        </div>
      {/if}
    {/if}
  </div>

  <div class="status-bar">
    <span class="status-dot"></span>
    <span>{lastUpdate}</span>
  </div>
</div>

<style>
  :global(body) {
    background: #100c00;
    color: #fef6d0;
    min-height: 100vh;
    overflow-x: hidden;
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

  .status-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 40px;
    font-size: 13px;
    color: #8a7430;
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

  .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state p { font-size: 16px; }

  @media (max-width: 480px) {
    .podium { gap: 8px; }
  }
</style>
