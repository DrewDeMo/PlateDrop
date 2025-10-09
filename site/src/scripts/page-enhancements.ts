const SCROLL_THRESHOLD = 500;
const animatedSelectors = ['.feature-card', '.category-card', '.value-prop-card', '.deal-wrapper'];

function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (!scrollToTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSmoothAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') {
        return;
      }

      const target = document.querySelector<HTMLElement>(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initRevealAnimations() {
  if (!('IntersectionObserver' in window)) {
    animatedSelectors
      .flatMap(selector => Array.from(document.querySelectorAll<HTMLElement>(selector)))
      .forEach(element => element.classList.add('animate-fade-in'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animatedSelectors.forEach(selector => {
    document.querySelectorAll<HTMLElement>(selector).forEach(element => observer.observe(element));
  });
}

function init() {
  initScrollToTop();
  initSmoothAnchors();
  initRevealAnimations();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init, { once: true });
}
