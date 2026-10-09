(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const progress = document.querySelector('.scroll-progress');
  let queued = false;
  const updateProgress = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
    queued = false;
  };
  window.addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section-heading, .project, .about > div, .contact').forEach(element => {
      element.classList.add('reveal');
      observer.observe(element);
    });
  }

  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', event => {
    if (motion.matches || !finePointer.matches) return;
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.classList.add('active');
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => glow.classList.remove('active'));

  document.querySelectorAll('.project-art').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (motion.matches || !finePointer.matches) return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
      document.querySelectorAll('.project-art').forEach(card => { card.style.transform = ''; });
      glow.classList.remove('active');
    }
  });
})();
