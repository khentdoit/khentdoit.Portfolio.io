/* ================================================================
   MAIN.JS — Particles, Nav hamburger, Stat counters, Active nav
   ================================================================ */

/* ── Hamburger Menu ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Mark active nav link based on current page
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
});

/* ── Canvas Particle System ──────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function Particle() {
    this.reset = function () {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.1;
    };
    this.reset();
  }

  for (let i = 0; i < COUNT; i++) { particles.push(new Particle()); }

  // Warm palette for particles
  const colors = ['#EEC5A0', '#AD6E54', '#c9a07a'];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Draw connecting lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = '#AD6E54';
          ctx.globalAlpha = (1 - dist / 110) * 0.08;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Animated Stat Counters ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let start    = 0;
      const dur    = 1400;
      const step   = 16;
      const inc    = target / (dur / step);

      const timer = setInterval(() => {
        start += inc;
        if (start >= target) {
          el.textContent = target + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start) + suffix;
        }
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
});

/* ── Animated Skill Bars ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const bars = document.querySelectorAll('.skill-fill[data-width]');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.width;
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  bars.forEach(b => obs.observe(b));
});

/* ── Typewriter Effect ───────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const lines  = JSON.parse(el.dataset.lines || '[]');
  let   li     = 0;
  let   ci     = 0;
  let   typing = true;

  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.parentNode.insertBefore(cursor, el.nextSibling);

  function tick() {
    const line = lines[li];
    if (typing) {
      el.textContent = line.slice(0, ++ci);
      if (ci >= line.length) {
        typing = false;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 58);
    } else {
      el.textContent = line.slice(0, --ci);
      if (ci <= 0) {
        typing = true;
        li = (li + 1) % lines.length;
        setTimeout(tick, 500);
        return;
      }
      setTimeout(tick, 30);
    }
  }
  setTimeout(tick, 800);
})();
