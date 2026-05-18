/* ================================================================
   CAROUSEL.JS — Ken Burns effect slider
   Autoplay 5s · Pause on hover · Arrow controls · Dot pagination · Touch swipe
   ================================================================ */

(function () {
  const track    = document.querySelector('.carousel-track');
  if (!track) return;

  const slides   = Array.from(track.querySelectorAll('.carousel-slide'));
  const dotsWrap = document.querySelector('.carousel-dots');
  const prevBtn  = document.querySelector('.carousel-prev');
  const nextBtn  = document.querySelector('.carousel-next');

  if (!slides.length) return;

  const KB_EFFECTS = ['kb-zoom-in', 'kb-zoom-out', 'kb-pan'];
  let current  = 0;
  let timer    = null;
  let paused   = false;
  let touchSX  = 0;

  /* Build dot indicators */
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className   = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function getDots() { return Array.from(dotsWrap.querySelectorAll('.carousel-dot')); }

  function goTo(idx) {
    const prev = current;
    current    = (idx + slides.length) % slides.length;

    // Remove active from previous
    slides[prev].classList.remove('active');
    getDots()[prev]?.classList.remove('active');

    // Reset and re-apply Ken Burns on new slide bg
    const bg = slides[current].querySelector('.slide-bg');
    if (bg) {
      KB_EFFECTS.forEach(c => bg.classList.remove(c));
      void bg.offsetWidth; // reflow to restart animation
      bg.classList.add(KB_EFFECTS[current % KB_EFFECTS.length]);
    }

    slides[current].classList.add('active');
    getDots()[current]?.classList.add('active');

    resetTimer();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function resetTimer() {
    clearInterval(timer);
    if (!paused) timer = setInterval(next, 5000);
  }

  /* Arrow controls */
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  /* Keyboard controls */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  /* Pause on hover */
  track.addEventListener('mouseenter', () => { paused = true;  clearInterval(timer); });
  track.addEventListener('mouseleave', () => { paused = false; resetTimer(); });

  /* Touch swipe */
  track.addEventListener('touchstart', e => { touchSX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchSX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  });

  /* Init first slide */
  slides[0].classList.add('active');
  const firstBg = slides[0].querySelector('.slide-bg');
  if (firstBg) firstBg.classList.add(KB_EFFECTS[0]);

  resetTimer();
})();
