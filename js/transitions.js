/* ================================================================
   TRANSITIONS.JS — Smooth page fade in/out on navigation
   ================================================================ */

(function () {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  // Fade in on load
  window.addEventListener('DOMContentLoaded', () => {
    overlay.classList.add('fade-in');
    requestAnimationFrame(() => {
      overlay.classList.remove('fade-in');
    });
  });

  // Intercept internal link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Only intercept same-origin .html links (not # anchors, not external)
    const isExternal = link.target === '_blank' || href.startsWith('http') || href.startsWith('//');
    const isAnchor   = href.startsWith('#');
    const isMailto   = href.startsWith('mailto');
    if (isExternal || isAnchor || isMailto) return;

    e.preventDefault();

    overlay.classList.add('fade-in');
    setTimeout(() => {
      window.location.href = href;
    }, 340);
  });

  // Intersection Observer for .fade-up elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
  });
})();
