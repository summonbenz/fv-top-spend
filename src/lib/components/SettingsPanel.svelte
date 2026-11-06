<script>
  /**
   * @type {{
   *   settings: { rankingList: number, podiumCount: number, fontScale: number, podiumHeight: number, headerScale: number, titleScale: number },
   *   defaults: object,
   *   maxRanking?: number
   * }}
   */
  let { settings = $bindable(), defaults, maxRanking = 20 } = $props();

  let open = $state(false);

  const pct = (v) => `${Math.round(v * 100)}%`;

  function setRanking(v) {
    settings.rankingList = v;
    if (settings.podiumCount > v) settings.podiumCount = v;
  }

  function reset() {
    Object.assign(settings, defaults);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') open = false;
  }
</script>

<svelte:window onkeydown={onKeydown} />

<button
  type="button"
  class="settings-toggle"
  class:active={open}
  aria-label="ตั้งค่าการแสดงผล"
  aria-expanded={open}
  onclick={() => (open = !open)}
>
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path
      d="M10.3 2.6h3.4l.5 2.6c.6.2 1.2.5 1.7.9l2.5-.9 1.7 2.9-2 1.7c.1.6.1 1.3 0 1.9l2 1.7-1.7 2.9-2.5-.9c-.5.4-1.1.7-1.7.9l-.5 2.6h-3.4l-.5-2.6c-.6-.2-1.2-.5-1.7-.9l-2.5.9-1.7-2.9 2-1.7a6 6 0 0 1 0-1.9l-2-1.7 1.7-2.9 2.5.9c.5-.4 1.1-.7 1.7-.9z"
      fill="#fde4ee" stroke="#e0608e" stroke-width="1.6" stroke-linejoin="round"
    />
    <circle cx="12" cy="12" r="2.8" fill="#ffffff" stroke="#e0608e" stroke-width="1.6" />
  </svg>
</button>

{#if open}
  <div class="settings-backdrop" role="presentation" onclick={() => (open = false)}></div>
  <div class="settings-panel" role="dialog" aria-label="ตั้งค่าการแสดงผล">
    <div class="panel-title">⚙️ ตั้งค่าการแสดงผล</div>

    <label class="row">
      <span class="row-head"><span>จำนวนอันดับที่แสดง</span><b>{settings.rankingList}</b></span>
      <input type="range" min="1" max={maxRanking} step="1"
        value={settings.rankingList}
        oninput={(e) => setRanking(Number(e.currentTarget.value))} />
    </label>

    <label class="row">
      <span class="row-head"><span>จำนวนการ์ด podium</span><b>{settings.podiumCount}</b></span>
      <input type="range" min="1" max={Math.min(3, settings.rankingList)} step="1"
        bind:value={settings.podiumCount} disabled={settings.rankingList < 2} />
    </label>

    <label class="row">
      <span class="row-head"><span>ขนาดตัวอักษร</span><b>{pct(settings.fontScale)}</b></span>
      <input type="range" min="0.6" max="2" step="0.05" bind:value={settings.fontScale} />
    </label>

    <label class="row">
      <span class="row-head">
        <span>ความสูง podium</span>
        <b>{settings.podiumHeight === 0 ? 'อัตโนมัติ' : `${settings.podiumHeight}px`}</b>
      </span>
      <input type="range" min="0" max="240" step="4" bind:value={settings.podiumHeight} />
    </label>

    <label class="row">
      <span class="row-head"><span>ขนาด header</span><b>{pct(settings.headerScale)}</b></span>
      <input type="range" min="0.4" max="2" step="0.05" bind:value={settings.headerScale} />
    </label>

    <label class="row">
      <span class="row-head"><span>ขนาด Top Spender</span><b>{pct(settings.titleScale)}</b></span>
      <input type="range" min="0.3" max="2" step="0.05" bind:value={settings.titleScale} />
    </label>

    <div class="actions">
      <button type="button" class="btn ghost" onclick={reset}>รีเซ็ต</button>
      <button type="button" class="btn" onclick={() => (open = false)}>ปิด</button>
    </div>
  </div>
{/if}

<style>
  .settings-toggle {
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 20;
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid #ffffff;
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 0 4px 14px rgba(241, 116, 158, 0.25);
    cursor: pointer;
    opacity: 0.35;
    transition: opacity 0.2s ease, transform 0.4s ease;
  }

  .settings-toggle:hover,
  .settings-toggle:focus-visible,
  .settings-toggle.active {
    opacity: 1;
  }

  .settings-toggle.active { transform: rotate(60deg); }

  .settings-backdrop {
    position: fixed;
    inset: 0;
    z-index: 18;
  }

  .settings-panel {
    position: fixed;
    top: 60px;
    left: 12px;
    z-index: 19;
    width: 280px;
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 16px 18px;
    background: rgba(255, 255, 255, 0.92);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    border: 4px solid #ffffff;
    border-radius: 24px;
    box-shadow: 0 12px 32px rgba(241, 116, 158, 0.25);
    font-family: 'Mali', sans-serif;
    color: #33274a;
  }

  .panel-title {
    font-family: 'Fredoka', 'Mali', sans-serif;
    font-weight: 600;
    font-size: 17px;
    margin-bottom: 12px;
  }

  .row {
    display: block;
    margin-bottom: 12px;
  }

  .row-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .row-head b {
    font-family: 'Fredoka', 'Mali', sans-serif;
    font-weight: 600;
    color: #e0608e;
  }

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 18px;
    margin: 0;
    background: transparent;
    cursor: pointer;
  }

  input[type='range']::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 100px;
    background: #fbd3e2;
  }

  input[type='range']::-moz-range-track {
    height: 6px;
    border-radius: 100px;
    background: #fbd3e2;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    margin-top: -6px;
    border-radius: 50%;
    background: #f1749e;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 6px rgba(224, 96, 142, 0.4);
  }

  input[type='range']::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #f1749e;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 6px rgba(224, 96, 142, 0.4);
  }

  input[type='range']:disabled { opacity: 0.4; }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
  }

  .actions > * + * { margin-left: 8px; }

  .btn {
    font-family: 'Mali', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 100px;
    border: 2px solid #f1749e;
    background: #f1749e;
    color: #ffffff;
    cursor: pointer;
  }

  .btn.ghost {
    background: #ffffff;
    color: #e0608e;
  }
</style>
