<script>
  import { formatAmount } from '$lib/api.js';

  let { data } = $props();

  let query = $state('');

  const filtered = $derived(
    query.trim() === ''
      ? data.spenders
      : data.spenders.filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.phone.includes(query.replace(/\D/g, ''))
        )
  );

  const total = $derived(filtered.reduce((sum, s) => sum + s.total, 0));
</script>

<svelte:head>
  <title>รายชื่อทั้งหมด — Staff</title>
</svelte:head>

<div class="page">
  <div class="container">
    <div class="header">
      <div>
        <h1>รายชื่อทั้งหมด</h1>
        <p class="subtitle">
          {filtered.length === data.spenders.length
            ? `${data.spenders.length} คน`
            : `${filtered.length} / ${data.spenders.length} คน`}
          · ยอดรวม ฿{formatAmount(total)}
        </p>
      </div>
      <a href="/staff" class="btn-back">← กลับ</a>
    </div>

    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input
        class="search-input"
        type="search"
        placeholder="ค้นหาชื่อหรือเบอร์โทร..."
        bind:value={query}
      />
      {#if query}
        <button class="search-clear" onclick={() => query = ''}>✕</button>
      {/if}
    </div>

    {#if filtered.length === 0}
      <div class="empty">
        <div class="icon">📋</div>
        <p>ยังไม่มีข้อมูล</p>
      </div>
    {:else}
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="col-rank">#</th>
              <th>ชื่อ-นามสกุล</th>
              <th>เบอร์โทร</th>
              <th class="col-amount">ยอดรวม</th>
            </tr>
          </thead>
          <tbody>
            {#each filtered as item, i}
              <tr class:top3={i < 3}>
                <td class="col-rank">
                  {#if i === 0}🥇
                  {:else if i === 1}🥈
                  {:else if i === 2}🥉
                  {:else}{i + 1}
                  {/if}
                </td>
                <td class="name">{item.name}</td>
                <td class="phone">{item.phone}</td>
                <td class="col-amount amount">฿{formatAmount(item.total)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    background: #0f0f14;
    color: #f0f0f5;
    min-height: 100vh;
    padding: 40px 24px 80px;
    font-family: 'Sarabun', sans-serif;
  }

  .container {
    max-width: 720px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 32px;
    gap: 16px;
  }

  h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 14px;
    color: #6b6b80;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #1a1a24;
    border: 1px solid #2a2a38;
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #f0f0f5;
    text-decoration: none;
    white-space: nowrap;
    transition: border-color 0.2s;
    flex-shrink: 0;
  }

  .btn-back:hover { border-color: #7c6af7; color: #a89af9; }

  .search-wrap {
    position: relative;
    margin-bottom: 20px;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: #1a1a24;
    border: 1.5px solid #2a2a38;
    border-radius: 12px;
    padding: 13px 40px 13px 40px;
    font-size: 15px;
    font-family: 'Sarabun', sans-serif;
    color: #f0f0f5;
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input:focus { border-color: #7c6af7; }
  .search-input::placeholder { color: #3a3a50; }

  .search-clear {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b6b80;
    font-size: 13px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
  }

  .search-clear:hover { color: #f0f0f5; }

  .table-wrap {
    background: #1a1a24;
    border: 1px solid #2a2a38;
    border-radius: 16px;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead tr {
    background: #141420;
    border-bottom: 1px solid #2a2a38;
  }

  th {
    padding: 14px 20px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #6b6b80;
    text-align: left;
  }

  td {
    padding: 14px 20px;
    font-size: 15px;
    border-bottom: 1px solid #1e1e2e;
  }

  tbody tr:last-child td { border-bottom: none; }

  tbody tr:hover td { background: rgba(124, 106, 247, 0.04); }

  .top3 td { background: rgba(245, 200, 66, 0.03); }
  .top3:hover td { background: rgba(245, 200, 66, 0.06); }

  .col-rank {
    width: 48px;
    text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: #6b6b80;
    font-size: 13px;
  }

  .col-amount {
    text-align: right;
  }

  .name { font-weight: 600; }

  .phone {
    font-size: 14px;
    color: #6b6b80;
    font-family: monospace;
    letter-spacing: 0.5px;
  }

  .amount {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    color: #7c6af7;
    font-size: 16px;
  }

  .empty {
    text-align: center;
    padding: 60px 20px;
    color: #6b6b80;
  }

  .empty .icon { font-size: 48px; margin-bottom: 16px; }
  .empty p { font-size: 16px; }

  @media (max-width: 480px) {
    .page { padding: 24px 16px 60px; }
    th, td { padding: 12px 14px; }
    h1 { font-size: 22px; }
  }
</style>
