<script>
  let { message = $bindable(''), type = $bindable(''), visible = $bindable(false) } = $props();
</script>

<div class="toast" class:show={visible} class:success={type === 'success'} class:error={type === 'error'}>
  {message}
</div>

<style>
  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #1a1a24;
    border: 1px solid #2a2a38;
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 100;
    white-space: nowrap;
  }

  .toast.show { transform: translateX(-50%) translateY(0); }
  .toast.success { border-color: rgba(52, 211, 153, 0.4); color: #34d399; }
  .toast.error { border-color: rgba(248, 113, 113, 0.4); color: #f87171; }
</style>
