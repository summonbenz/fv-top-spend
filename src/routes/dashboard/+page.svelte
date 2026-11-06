<script>
  import { onMount, onDestroy, tick, untrack } from 'svelte';
  import PodiumCard from '$lib/components/PodiumCard.svelte';
  import LeaderboardRow from '$lib/components/LeaderboardRow.svelte';
  import SettingsPanel from '$lib/components/SettingsPanel.svelte';
  import { fetchTopSpenders } from '$lib/api.js';

  const REFRESH_INTERVAL = 60000;

  const SETTINGS_KEY = 'dashboard-settings';
  const MAX_RANKING = 20;

  const envRanking = Math.min(MAX_RANKING, Math.max(1, Number(__RANKING_LIST__) || 10));
  const envHighlight = Math.max(1, Number(__HIGHLIGHT_START__) || 3);

  const DEFAULT_SETTINGS = {
    rankingList: envRanking,
    podiumCount: Math.min(3, envRanking, envHighlight),
    fontScale: 1,
    podiumHeight: 0,
    headerScale: 1,
    titleScale: 1
  };

  let settings = $state({ ...DEFAULT_SETTINGS });
  let settingsLoaded = false;

  const rankingList = $derived(settings.rankingList);
  const podiumCount = $derived(Math.min(settings.podiumCount, settings.rankingList));

  let spenders = $state([]);
  let lastUpdate = $state('—');
  let status = $state('loading'); // 'loading' | 'ok' | 'error' | 'empty'
  let paused = $state(false);
  let maskingPrefix = $state(false);
  let noticeMessage = $state('');
  let interval;
  let revealCount = $state(0);
  let revealTimer;
  let revealDelayTimer;

  const visibleSpenders = $derived(spenders.slice(0, rankingList));

  // Save settings whenever they change (after the saved ones were loaded)
  $effect(() => {
    const snapshot = JSON.stringify(settings);
    if (!settingsLoaded) return;
    try { localStorage.setItem(SETTINGS_KEY, snapshot); } catch {}
  });

  // When the number of shown ranks changes, show the new rows right away
  // (only rankingList is tracked, so the normal reveal animation on data refresh is untouched)
  $effect(() => {
    rankingList;
    untrack(() => {
      if (status === 'ok' && !paused) revealCount = Math.max(revealCount, visibleSpenders.length);
    });
  });

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        for (const key of Object.keys(DEFAULT_SETTINGS)) {
          const v = Number(saved[key]);
          if (Number.isFinite(v)) settings[key] = v;
        }
      }
    } catch {}
    settingsLoaded = true;
  }
  const top3 = $derived(visibleSpenders.slice(0, podiumCount));
  const rest = $derived(visibleSpenders.slice(podiumCount));

  function clearRevealTimers() {
    clearInterval(revealTimer);
    clearTimeout(revealDelayTimer);
  }

  function startRevealSequence() {
    clearRevealTimers();
    const total = visibleSpenders.length;
    if (total === 0) {
      revealCount = 0;
      return;
    }

    revealCount = 0;

    revealDelayTimer = setTimeout(() => {
      revealCount = 1;
      revealTimer = setInterval(() => {
        revealCount = Math.min(revealCount + 1, total);
        if (revealCount >= total) {
          clearInterval(revealTimer);
        }
      }, 320);
    }, 220);
  }

  async function load() {
    try {
      const data = await fetchTopSpenders();

      paused = data.pause === true || String(data.pause).toLowerCase() === 'true';
      maskingPrefix = data.maskingPrefix === true || String(data.maskingPrefix).toLowerCase() === 'true';
      noticeMessage = data.messageNotice ? String(data.messageNotice) : '';

      if (paused) {
        clearRevealTimers();
        revealCount = 0;
        status = 'ok';
        lastUpdate = `อัปเดทล่าสุด ${new Date().toLocaleTimeString('th-TH')}`;
        return;
      }

      if (data.topSpenders?.length > 0) {
        const prevRanks = {};
        spenders.forEach((s, i) => { prevRanks[s.phone] = i + 1; });

        spenders = data.topSpenders.slice(0, MAX_RANKING).map((s, i) => {
          const prev = prevRanks[s.phone];
          const newRank = i + 1;
          return { ...s, rankChange: prev !== undefined ? prev - newRank : 0 };
        });
        status = 'ok';

        await tick();
        startRevealSequence();

        setTimeout(() => {
          spenders = spenders.map(s => ({ ...s, rankChange: 0 }));
        }, 3000);
      } else {
        spenders = [];
        revealCount = 0;
        status = 'empty';
      }
      lastUpdate = `อัปเดทล่าสุด ${new Date().toLocaleTimeString('th-TH')}`;
    } catch {
      status = status === 'loading' ? 'error' : status;
      lastUpdate = '⚠️ ไม่สามารถเชื่อมต่อได้';
    }
  }

  onMount(() => {
    loadSettings();
    load();
    interval = setInterval(load, REFRESH_INTERVAL);
  });

  onDestroy(() => {
    clearRevealTimers();
    clearInterval(interval);
  });
</script>

<svelte:head>
  <title>Top Spender Dashboard</title>
</svelte:head>

    <div class="bg-overlay"></div>
<div class="bg-orb orb-1"></div>
<div class="bg-orb orb-2"></div>
<div class="fleurvive">
  <img src="/logo.webp" alt="Sunflower" class="fleurvive-img" />
</div>
<SettingsPanel bind:settings defaults={DEFAULT_SETTINGS} maxRanking={MAX_RANKING} />
<div
  class="container"
  style:--font-scale={settings.fontScale}
  style:--podium-height="{settings.podiumHeight}px"
  style:--header-scale={settings.headerScale}
  style:--title-scale={settings.titleScale}
>
  <header>
    <img src="/header.webp" alt="header Logo" class="logo-img" />
    <div class="heading-text">
      <span class="title-highlight">
        <img src="/top_spender.png" alt="Top Spender" class="title-img" />
      </span>
    </div>
    <!-- <div class="event-badge">Live Ranking</div> -->
  </header>

  <div id="content-outer">
    <div id="content">
      {#if status === 'loading'}
        <div class="empty-state">
          <div class="spinner" aria-label="กำลังโหลด" role="status"></div>
          <p class="text-black">รอสักครู่ ...</p>
        </div>
      {:else if status === 'empty' || status === 'error'}
        <div class="empty-state">
          <div class="icon">🧸</div>
          <p>{status === 'error' ? '⚠️ ไม่สามารถโหลดข้อมูลได้' : 'ยังไม่มีข้อมูล รอ staff กรอกยอดแรก!'}</p>
        </div>
      {:else if paused}
        <div class="paused-state">
          <div class="paused-icon">💤</div>
          <p class="paused-text">ปิดการแสดงยอดแล้ว ฝันดีนะ<br/>รอประกาศผล</p>
        </div>
      {:else}
        <div class="podium-section">
          <div class="podium">
            {#each top3 as item, i (item?.phone ?? `podium-slot-${i}`)}
              <div style:opacity={i + 1 <= revealCount ? 1 : 0} style:transition="opacity 0.35s ease">
                <PodiumCard {item} rank={i + 1} rankChange={item?.rankChange ?? 0} {maskingPrefix} />
              </div>
            {/each}
          </div>
        </div>

        {#if rest.length > 0}
          <div class="leaderboard">
            {#each rest as item, i (item?.phone ?? `leader-slot-${i}`)}
              <div style:opacity={i + podiumCount + 1 <= revealCount ? 1 : 0} style:transition="opacity 0.35s ease">
                <LeaderboardRow {item} rankChange={item?.rankChange ?? 0} {maskingPrefix} />
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
</div>
<div id="marquee">
  <div class="marquee-track">
    {@html noticeMessage}
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
    background: #f9e9fa url('/bg.png') center center / cover no-repeat fixed;
    color: #49365f;
    font-family: 'Mali', sans-serif;
    min-height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
  }

  .text-black{
    color: #49365f;
  }

  .bg-overlay {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 249, 246, 0.18), rgba(255, 238, 250, 0.12));
    pointer-events: none;
    z-index: 0;
  }
  #content-outer{
    background: rgba(255, 255, 255, 0.4);
    /* -webkit-backdrop-filter: blur(10px); */
    /* backdrop-filter: blur(10px); */
    /* border: 4px solid #ffffff; */
    border-radius: 30px;
    padding: 30px;
    box-shadow: 0 12px 32px rgba(241, 116, 158, 0.2);
  }

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
    background: radial-gradient(circle, rgba(255, 218, 133, 0.34), transparent 70%);
    top: -120px; left: -120px;
  }

  .orb-2 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(180, 161, 255, 0.32), transparent 70%);
    bottom: -80px; right: -80px;
  }

  .container {
    position: relative;
    z-index: 1;
    font-family: 'Mali', sans-serif;
    width: min(100%, 1200px);
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
    width: calc(20vw * var(--header-scale, 1));
    height: auto;
    margin: 0 auto;
    animation: float 4s ease-in-out infinite;
    will-change: transform;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .logo-img { animation: none; }
  }

  .title-img {
    width: calc(624px * var(--title-scale, 1));
    max-width: 100%;
    height: auto;
  }

  header {
    text-align: center;
    margin-bottom: clamp(12px, 1vh, 32px);
    flex-shrink: 0;
  }

  .heading-text{
    font-size: 3vw;
    margin-top: 5px;
  }

  .event-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    --gap: 8px;
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
    font-size: clamp(32px, 6vw, 52px);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 12px;
    text-shadow: 0 12px 12px rgba(0,0,0,0.1);
  }

  .title-highlight {
    background: linear-gradient(100deg, #8b5dc2 12%, #dd70ae 58%, #e99b65 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 800;
    -webkit-text-stroke: 3px #fff;
    paint-order: stroke fill;
    text-shadow: none;
  }

  .subtitle {
    font-size: 15px;
    color: #614d78;
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
    color: #795b9d;
    margin-bottom: 20px;
    text-align: center;
  }

  .podium {
    display: grid;
    row-gap: 12px;
    width: 100%;
  }

  .podium > div + div { margin-top: 12px; }

  .leaderboard {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .leaderboard > div + div { margin-top: 12px; }

  @supports (gap: 1px) {
    .podium > div + div,
    .leaderboard > div + div { margin-top: 0; }
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
    --gap: 12px;
    margin-top: 0;
    font-size: 13px;
    color: #5c4775;
    background: rgba(255, 255, 255, 0.78);
    border: 1px solid rgba(179, 145, 211, 0.42);
    border-radius: 100px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 16px rgba(124, 81, 151, 0.12);
  }

  /* gap fallbacks for older WebView */
  .event-badge > * + * { margin-left: var(--gap); }
  .status-bar > * + * { margin-left: var(--gap); }
  @supports (gap: 1px) {
    .event-badge > * + * { margin-left: 0; }
    .status-bar > * + * { margin-left: 0; }
  }

  .status-dot {
    width: 8px; height: 8px;
    background: #ed79a8;
    border-radius: 50%;
    animation: pulse 2s infinite;
    margin-right: 2px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #624c7b;
  }

  .paused-state {
    text-align: center;
    padding: 60px 20px;
  }

  .paused-icon { font-size: 48px; margin-bottom: 16px; }

  .paused-text {
    font-size: clamp(18px, 5vw, 26px);
    font-weight: 600;
    color: #674b88;
    line-height: 1.6;
    text-shadow: 0 2px 12px rgba(255, 255, 255, 0.8);
  }

  .info{
    text-align:center;
    margin-top: 20px;
    text-shadow: 0 0 12px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8), 0 0 30px rgba(0,0,0,0.6);
  }
  :global(.text-underline) {
    text-decoration: underline;
    text-decoration-color: rgba(139, 93, 194, 0.7);
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
  }

  .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
  .empty-state p { font-size: 16px; }

  #marquee{
    background: rgba(255, 249, 253, 0.92);
    color: #684879;
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
    border-top: 2px dashed rgba(241, 116, 158, 0.45);
    box-shadow: 0 -4px 18px rgba(130, 78, 148, 0.12);
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
    border: 4px solid rgba(159, 119, 190, 0.18);
    border-top-color: #e879ad;
    border-right-color: rgba(139, 93, 194, 0.65);
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
    width: 10vw;
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
