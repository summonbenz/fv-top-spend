<script>
  import Toast from '$lib/components/Toast.svelte';
  import { checkPhone, addTransaction } from '$lib/api.js';
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  let phone = $state('');
  let name = $state('');
  let amount = $state('');
  let knownName = $state('');
  let isChecking = $state(false);
  let isSubmitting = $state(false);
  let toast = $state({ visible: false, type: '', message: '' });

  let checkTimer;

  function showToast(type, message) {
    toast = { visible: true, type, message };
    setTimeout(() => { toast = { ...toast, visible: false }; }, 3000);
  }

  function resetNameField() {
    knownName = '';
    name = '';
    isChecking = false;
  }

  async function onPhoneInput(e) {
    const val = e.target.value.replace(/\D/g, '');
    phone = val;
    resetNameField();
    clearTimeout(checkTimer);

    if (val.length === 10) {
      isChecking = true;
      checkTimer = setTimeout(async () => {
        try {
          const data = await checkPhone(val);
          isChecking = false;
          if (data.found) {
            knownName = data.name;
          }
        } catch {
          isChecking = false;
          showToast('error', '⚠️ ไม่สามารถเชื่อมต่อได้');
        }
      }, 600);
    }
  }

  async function submit() {
    const resolvedName = knownName || name.trim();
    if (phone.length !== 10) return showToast('error', '⚠️ กรุณากรอกเบอร์ 10 หลัก');
    if (!resolvedName) return showToast('error', '⚠️ กรุณากรอกชื่อ-นามสกุล');
    if (!amount || Number(amount) <= 0) return showToast('error', '⚠️ กรุณากรอกยอดที่ถูกต้อง');

    isSubmitting = true;
    try {
      const data = await addTransaction(phone, resolvedName, Number(amount));
      if (data.success) {
        showToast('success', `✅ บันทึกยอด ฿${Number(amount).toLocaleString()} แล้ว`);
        phone = '';
        name = '';
        amount = '';
        resetNameField();
      } else {
        showToast('error', '❌ ' + (data.error || 'เกิดข้อผิดพลาด'));
      }
    } catch {
      showToast('error', '⚠️ ไม่สามารถเชื่อมต่อได้');
    }
    isSubmitting = false;
  }
</script>

<svelte:head>
  <title>บันทึกยอด — Staff</title>
</svelte:head>

{#if !data.authenticated}
  <!-- ── หน้า Login ── -->
  <div class="page">
    <div class="card">
      <div class="logo">
        <div class="logo-badge">Staff Portal</div>
        <h1>ใส่รหัสผ่าน</h1>
        <p>กรุณากรอกรหัสเพื่อเข้าใช้งาน</p>
      </div>

      <form method="POST" action="?/login" use:enhance>
        <div class="field">
          <label for="code">รหัสผ่าน</label>
          <input
            id="code"
            name="code"
            type="password"
            placeholder="••••••••"
            autocomplete="off"
            autofocus
          />
        </div>

        {#if form?.error}
          <div class="error-hint">{form.error}</div>
        {/if}

        <button class="btn" type="submit">เข้าสู่ระบบ</button>
      </form>
    </div>
  </div>

{:else}
  <!-- ── หน้า Staff Form ── -->
  <div class="page">
    <div class="card">
      <div class="logo">
        <div class="logo-badge">Staff Portal</div>
        <h1>บันทึกยอดซื้อ</h1>
        <p>กรอกข้อมูลลูกค้าและยอดซื้อ</p>
      </div>

      <div class="field">
        <label for="phone">เบอร์โทรศัพท์</label>
        <input
          id="phone"
          type="tel"
          placeholder="0812345678"
          maxlength="10"
          autocomplete="off"
          value={phone}
          oninput={onPhoneInput}
        />
        {#if isChecking}
          <div class="checking-hint">⏳ กำลังตรวจสอบ...</div>
        {/if}
      </div>

      <div class="field">
        <label for="name">ชื่อ-นามสกุล</label>
        {#if knownName}
          <div class="name-found">
            <div class="name-found-icon">✓</div>
            <div>
              <div class="name-found-text">{knownName}</div>
              <div class="name-found-sub">พบในระบบแล้ว</div>
            </div>
          </div>
        {:else}
          <input
            id="name"
            type="text"
            placeholder="สมชาย ใจดี"
            autocomplete="off"
            bind:value={name}
          />
        {/if}
      </div>

      <div class="field">
        <label for="amount">ยอดซื้อ (บาท)</label>
        <div class="amount-wrapper">
          <span class="amount-prefix">฿</span>
          <input
            id="amount"
            type="number"
            placeholder="0"
            min="1"
            bind:value={amount}
          />
        </div>
      </div>

      <button class="btn" onclick={submit} disabled={isSubmitting}>
        {#if isSubmitting}
          <span class="spinner"></span>กำลังบันทึก...
        {:else}
          บันทึกยอด
        {/if}
      </button>

      <div class="bottom-actions">
        <a href="/staff/list" class="btn-list">📋 ดูรายชื่อทั้งหมด</a>
        <form method="POST" action="?/logout" use:enhance>
          <button type="submit" class="btn-logout">ออกจากระบบ</button>
        </form>
      </div>
    </div>
  </div>

  <Toast bind:visible={toast.visible} bind:type={toast.type} bind:message={toast.message} />
{/if}

<style>
  .page {
    background: #0f0f14;
    color: #f0f0f5;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    font-family: 'Sarabun', sans-serif;
  }

  .card {
    background: #1a1a24;
    border: 1px solid #2a2a38;
    border-radius: 20px;
    padding: 36px 32px;
    width: 100%;
    max-width: 420px;
  }

  .logo {
    text-align: center;
    margin-bottom: 32px;
  }

  .logo-badge {
    display: inline-block;
    background: linear-gradient(135deg, #7c6af7, #a855f7);
    color: white;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 20px;
    margin-bottom: 12px;
  }

  .logo h1 { font-size: 22px; font-weight: 700; }
  .logo p { font-size: 13px; color: #6b6b80; margin-top: 4px; }

  .field { margin-bottom: 20px; }

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #6b6b80;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    background: #0f0f14;
    border: 1.5px solid #2a2a38;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 16px;
    font-family: 'Sarabun', sans-serif;
    color: #f0f0f5;
    transition: border-color 0.2s;
    outline: none;
  }

  input:focus { border-color: #7c6af7; }
  input::placeholder { color: #3a3a50; }

  .name-found {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(52, 211, 153, 0.08);
    border: 1.5px solid rgba(52, 211, 153, 0.3);
    border-radius: 12px;
    padding: 14px 16px;
  }

  .name-found-icon {
    width: 22px; height: 22px;
    background: #34d399;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 12px;
    color: #0f0f14;
  }

  .name-found-text { font-size: 15px; font-weight: 600; color: #34d399; }
  .name-found-sub { font-size: 12px; color: rgba(52, 211, 153, 0.6); margin-top: 1px; }

  .amount-wrapper { position: relative; }
  .amount-prefix {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b6b80;
    font-size: 15px;
    pointer-events: none;
  }
  .amount-wrapper input { padding-left: 42px; }

  .btn {
    width: 100%;
    background: linear-gradient(135deg, #7c6af7, #a855f7);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Sarabun', sans-serif;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.1s;
  }

  .btn:hover { opacity: 0.9; }
  .btn:active { transform: scale(0.98); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    display: inline-block;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .checking-hint {
    font-size: 12px;
    color: #a89af9;
    margin-top: 6px;
  }

  .error-hint {
    font-size: 13px;
    color: #f87171;
    margin-bottom: 12px;
    text-align: center;
  }

  .btn-logout {
    width: 100%;
    background: transparent;
    color: #6b6b80;
    border: 1px solid #2a2a38;
    border-radius: 12px;
    padding: 12px;
    font-size: 14px;
    font-family: 'Sarabun', sans-serif;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .btn-logout:hover { border-color: #f87171; color: #f87171; }

  .bottom-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
  }

  .bottom-actions form { margin: 0; }

  .btn-list {
    display: block;
    text-align: center;
    background: rgba(124, 106, 247, 0.1);
    color: #a89af9;
    border: 1px solid rgba(124, 106, 247, 0.3);
    border-radius: 12px;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
  }

  .btn-list:hover { background: rgba(124, 106, 247, 0.2); }
</style>
