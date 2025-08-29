  function showCopyToast(success = true) {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;

    toast.textContent = success ? "📋 계좌번호가 복사되었습니다!" : "복사에 실패했어요 😥";
    toast.style.backgroundColor = success ? "#CCE5FF" : "#F8D7DA";
    toast.style.color = success ? "#333" : "#842029";

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // ✅ 안전한 복사 유틸
  async function safeCopy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();

      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (_) {
      return false;
    }
  }

  // ✅ 이벤트 위임 + 토스트 표시
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;

    const text = btn.getAttribute('data-account');
    if (!text) return;

    const ok = await safeCopy(text);
    showCopyToast(ok);

    if (!ok) {
      // 최후 fallback: 직접 복사 유도
      try {
        window.prompt('복사 실패 😔\n아래 내용을 직접 복사해주세요.', text);
      } catch (_) {}
    }
  }, { passive: true });

function updateDdayCountdown() {
    const weddingDate = new Date("2025-11-08T00:00:00");
    const now = new Date();

    // 시간 차 계산 (하루 단위로)
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = weddingDate.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
    const diffInDays = Math.floor(diffInTime / oneDay);

    let displayText = "";

    if (diffInDays > 0) {
        displayText = `D-${diffInDays}`;
    } else if (diffInDays === 0) {
        displayText = `💍 D-Day`;
    } else {
        displayText = `💒 D+${Math.abs(diffInDays)}`;
    }

    document.getElementById("wedding-dcount-text").innerText = displayText;
}