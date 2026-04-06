const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const p = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = `${Math.max(0, Math.min(100, p))}%`;
  const topBtn = document.getElementById('toTopBtn');
  topBtn.classList.toggle('show', h.scrollTop > 360);
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let width = innerWidth;
let height = innerHeight;
let particles = [];

function buildParticles() {
  const mobile = width < 768;
  const count = mobile ? 60 : 120;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    s: Math.random() * (mobile ? 1.5 : 2) + 0.4,
    v: Math.random() * 0.8 + 0.2,
    a: Math.random() * 0.45 + 0.05,
  }));
}

function resize() {
  width = innerWidth;
  height = innerHeight;
  canvas.width = width;
  canvas.height = height;
  buildParticles();
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (const p of particles) {
    p.y += p.v;
    if (p.y > height) {
      p.y = 0;
      p.x = Math.random() * width;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(30,255,188,${p.a})`;
    ctx.fill();
  }
  requestAnimationFrame(animate);
}

resize();
animate();
addEventListener('resize', resize);

for (const c of document.querySelectorAll('.step-card')) {
  c.querySelector('.step-head').addEventListener('click', () => {
    const active = c.classList.contains('active');
    c.classList.toggle('active', !active);
    c.querySelector('.step-head span').textContent = active ? '+' : '−';
  });
}

let adminJoined = false;
const chat = document.getElementById('chatMessages');
function pushMsg(text) {
  const d = document.createElement('div');
  d.className = 'msg';
  d.textContent = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById('addAdminBtn').addEventListener('click', () => {
  if (adminJoined) return pushMsg('Admin: Already present.');
  adminJoined = true;
  pushMsg('Admin: Joined and ready to verify deals.');
  document.getElementById('verifyBtn').disabled = false;
});

document.getElementById('verifyBtn').addEventListener('click', () => {
  if (!adminJoined) return pushMsg('System: Add admin first.');
  pushMsg('Admin: Verification complete.');
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  const text = document.getElementById('onionText').textContent;
  const b = document.getElementById('copyBtn');
  const prev = b.textContent;
  try {
    await navigator.clipboard.writeText(text);
    b.textContent = 'COPIED';
  } catch {
    b.textContent = 'COPY FAILED';
  }
  setTimeout(() => b.textContent = prev, 1200);
});

const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('revealed');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

const navLinks = [...document.querySelectorAll('.navbar a')];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.remove('active'));
    const link = document.querySelector(`.navbar a[href="#${entry.target.id}"]`);
    if (link) link.classList.add('active');
  });
}, { threshold: 0.45 });

document.querySelectorAll('main section[id]').forEach((s) => navObserver.observe(s));

const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImage');
const lbClose = document.getElementById('lightboxClose');
document.querySelectorAll('.preview-img').forEach((img) => {
  img.addEventListener('click', () => {
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  });
});

function closeLightbox() {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
}

lb.addEventListener('click', (e) => {
  if (e.target === lb) closeLightbox();
});
lbClose.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

document.getElementById('toTopBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('.mini-copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const value = btn.getAttribute('data-copy') || '';
    if (!value) return;
    const prev = btn.textContent;
    try {
      await navigator.clipboard.writeText(value);
      btn.textContent = 'Copied';
    } catch {
      btn.textContent = 'Failed';
    }
    setTimeout(() => {
      btn.textContent = prev;
    }, 1200);
  });
});
