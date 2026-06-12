<script>
  import { maskPhone } from '$lib/api.js';
  import AnimatedNumber from './AnimatedNumber.svelte';

  /** @type {{ item: object }} */
  let { item } = $props();
</script>

<div class="lb-row animate-in">
  <div class="lb-rank">{item.rank}</div>
  <div class="lb-info">
    <div class="lb-name">{maskPhone(item.phone)}</div>
  </div>
  <div>
    <div class="lb-amount"><AnimatedNumber value={item.total} prefix="฿" /></div>
    <div class="lb-amount-label">ยอดรวม</div>
  </div>
</div>

<style>
  .lb-row {
    display: flex;
    align-items: center;
    background: #10101c;
    border: 1px solid #1e1e30;
    border-radius: 14px;
    padding: 16px 20px;
    gap: 16px;
    transition: border-color 0.2s;
  }

  .lb-row:hover { border-color: #2e2e45; }

  .lb-rank {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #55556a;
    width: 28px;
    text-align: center;
    flex-shrink: 0;
  }

  .lb-info { flex: 1; min-width: 0; }

  .lb-name {
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lb-phone {
    font-size: 12px;
    color: #55556a;
    margin-top: 2px;
  }

  .lb-amount {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #7c6af7;
    flex-shrink: 0;
  }

  .lb-amount-label {
    font-size: 10px;
    color: #55556a;
    text-align: right;
    margin-top: 1px;
    font-family: 'Sarabun', sans-serif;
    font-weight: 400;
  }
</style>
