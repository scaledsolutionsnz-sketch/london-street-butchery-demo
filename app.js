(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav: solid once you scroll off the hero, menu toggle on phones
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });

  // Hero: crossfade the real shop photos every 6 seconds
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1 && !reduced) {
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove('is-on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-on');
    }, 6000);
  }

  // Pop-in and count-up as sections scroll into view
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    function fmt(v) { return v.toLocaleString('en-NZ', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix; }
    if (reduced) { el.textContent = fmt(target); return; }
    var start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 1400, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var pops = document.querySelectorAll('.pop');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    pops.forEach(function (el) { io.observe(el); });
  } else {
    pops.forEach(function (el) { el.classList.add('in'); });
  }

  // Videos: only load the Facebook player when someone taps play
  document.querySelectorAll('.video-cover').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = btn.getAttribute('data-embed');
      f.title = btn.getAttribute('data-title');
      f.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
      f.allowFullscreen = true;
      f.setAttribute('scrolling', 'no');
      btn.replaceWith(f);
    });
  });

  // Email: built here so the address never sits in the HTML
  document.querySelectorAll('[data-email]').forEach(function (el) {
    var to = el.getAttribute('data-user') + '@' + el.getAttribute('data-domain');
    el.textContent = to;
  });
  document.querySelectorAll('a[data-gmail]').forEach(function (a) {
    var to = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    a.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) + '&su=' + (a.getAttribute('data-su') || '') + '&body=' + (a.getAttribute('data-body') || '');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
