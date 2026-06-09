// Reliable scroll reveal — no IntersectionObserver (unreliable in sandboxed iframes)
(function () {
  function reveal() {
    var h = window.innerHeight;
    var els = document.querySelectorAll('.reveal:not(.in)');
    for (var i = 0; i < els.length; i++) {
      if (els[i].getBoundingClientRect().top < h * 0.92) els[i].classList.add('in');
    }
  }
  window.addEventListener('scroll', reveal, { passive: true });
  window.addEventListener('resize', reveal, { passive: true });
  window.addEventListener('load', reveal);
  document.addEventListener('DOMContentLoaded', reveal);
  reveal();
  // safety net
  setTimeout(reveal, 100);
  setTimeout(reveal, 400);
})();
