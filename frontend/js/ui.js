(function () {
  function start() {
    const css = `
    .toast-wrap{position:fixed;right:20px;bottom:20px;display:flex;flex-direction:column;gap:10px;z-index:99999}
    .toast{min-width:260px;max-width:480px;background:#0f1520;border:1px solid #27324a;color:#e9eef5;
           padding:12px 14px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.35);opacity:.98;transition:all .25s}
    .toast.ok{border-color:#1f7e53;background:#13241c}
    .toast.err{border-color:#5a2030;background:#1c0c13}
    `;
    const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    const wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap);
    function show(msg, kind='ok', ms=3200){
      const el = document.createElement('div'); el.className = `toast ${kind}`;
      el.textContent = typeof msg === 'string' ? msg : (msg?.message || 'Ops…');
      wrap.appendChild(el);
      setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(6px)'; }, ms-250);
      setTimeout(()=>{ wrap.contains(el) && wrap.removeChild(el); }, ms);
    }
    window.toast = { ok:(m,ms)=>show(m,'ok',ms), err:(m,ms)=>show(m,'err',ms), info:(m,ms)=>show(m,'',ms) };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
