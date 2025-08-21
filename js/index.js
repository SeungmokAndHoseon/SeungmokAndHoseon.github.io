
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('copy-btn')) {
        const text = e.target.getAttribute('data-account');

        // Clipboard API 사용
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showCopyToast();
            }).catch(err => {
                console.error("복사 실패:", err);
            });
        } else {
            // fallback: execCommand 방식 (HTTP 환경 or 구형 브라우저)
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.focus();
            tempInput.select();
            try {
                const success = document.execCommand('copy');
                if (success) showCopyToast();
                else alert("복사 실패");
            } catch (err) {
                alert("복사 실패");
            }
            document.body.removeChild(tempInput);
        }
    }
});

function showCopyToast() {
    const toast = document.getElementById('copy-toast');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}


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