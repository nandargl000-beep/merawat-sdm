
// Theme toggle + persist
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
  themeToggle.textContent = '🌞';
} else {
  // default dark
  document.body.classList.remove('light');
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? '🌞' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Fade-in on scroll
const fades = document.querySelectorAll('.fade-in');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
fades.forEach(el => obs.observe(el));

// Parallax header art (basic)
const art = document.querySelector('.hero-art');
window.addEventListener('scroll', () => {
  if (!art) return;
  const rect = art.getBoundingClientRect();
  const y = window.scrollY * 0.12;
  art.style.transform = `translateY(${y}px)`;
});

// Audio: autoplay attempt, mute toggle, remember preference
const audioEl = document.getElementById('bg-audio');
const muteBtn = document.getElementById('mute-btn');

function setMuteState(isMuted) {
  audioEl.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
  localStorage.setItem('merawat_audio_muted', isMuted ? '1' : '0');
}

// try to restore preference
const savedMuted = localStorage.getItem('merawat_audio_muted');
if (savedMuted === '1') {
  setMuteState(true);
} else if (savedMuted === '0') {
  setMuteState(false);
} else {
  // default: not muted (user asked autoplay)
  setMuteState(false);
}

// autoplay attempt (some browsers block; fallback shows play button)
function tryAutoplay() {
  const p = audioEl.play();
  if (p !== undefined) {
    p.then(() => {
      // autoplay started
    }).catch(() => {
      // blocked — show small notice
      const hint = document.createElement('div');
      hint.textContent = 'Tap ▶ untuk memutar musik ambient';
      hint.style.position = 'fixed';
      hint.style.left = '50%';
      hint.style.bottom = '80px';
      hint.style.transform = 'translateX(-50%)';
      hint.style.padding = '8px 12px';
      hint.style.background = 'rgba(0,0,0,0.6)';
      hint.style.color = '#fff';
      hint.style.borderRadius = '8px';
      hint.style.zIndex = 9999;
      document.body.appendChild(hint);
      setTimeout(() => hint.remove(), 4000);
    });
  }
}
tryAutoplay();

muteBtn.addEventListener('click', () => {
  const nowMuted = !audioEl.muted;
  setMuteState(nowMuted);
});
