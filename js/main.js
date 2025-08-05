// 결혼식 날짜 설정 (예: 2025년 9월 5일 12:00)
const weddingDate = new Date("2025-09-05T12:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerText = "오늘은 결혼식 당일!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("countdown").innerText =`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
}

setInterval(updateCountdown, 1000);
updateCountdown(); // 초기 실행