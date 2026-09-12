// Site-wide scroll reveal: elements with [data-reveal] fade in as they enter the viewport.
// Optional data-reveal-delay="120" (ms) staggers siblings; children of [data-reveal-group] are staggered automatically.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!items.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Automatic stagger inside groups (e.g. thumbnail grids)
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const step = Number(group.dataset.revealGroup) || 60;
    Array.from(group.querySelectorAll<HTMLElement>(':scope > [data-reveal]')).forEach((el, i) => {
      el.dataset.revealDelay = String((i % 8) * step);
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.revealDelay) || 0;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        io.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );
  items.forEach((el) => io.observe(el));
}

init();
