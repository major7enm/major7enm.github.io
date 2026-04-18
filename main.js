// ============================================
//  Major7 E&M — main.js
// ============================================

// --- Dark Mode Toggle ---
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function updateIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggle.setAttribute('aria-label', '다크모드 ' + (theme === 'dark' ? '해제' : '전환'));
  }

  updateIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateIcon();
    });
  }
})();

// --- Sticky Header Shadow ---
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  }, { passive: true });
})();

// --- Hamburger Mobile Menu ---
(function () {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      menu.setAttribute('aria-hidden', true);
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

// --- Capability Tabs ---
(function () {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const content = document.getElementById('tab-' + target);
      if (content) content.classList.add('active');
    });
  });
})();

// --- Performance Tabs ---
(function () {
  const perfBtns = document.querySelectorAll('.perf-tab');
  const perfContents = document.querySelectorAll('.perf-content');

  perfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.perf;

      perfBtns.forEach(b => b.classList.remove('active'));
      perfContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const content = document.getElementById(target);
      if (content) content.classList.add('active');
    });
  });
})();

// --- Scroll Fade-In Animation ---
(function () {
  const elements = document.querySelectorAll('.section-title, .section-label, .about-desc, .info-row, .value-card, .business-card, .timeline-item, .capability-card, .perf-meta, .prog-item, .perf-item, .contact-form, .contact-info');

  elements.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// --- Contact Form (mailto) ---
function handleMailto(e) {
  e.preventDefault();
  const form = e.target;
  const name    = form.querySelector('#name').value.trim();
  const contact = form.querySelector('#contact-email').value.trim();
  const subject = form.querySelector('#subject').value || '기타';
  const message = form.querySelector('#message').value.trim();

  const mailSubject = encodeURIComponent('[메이저세븐이엔엠 문의] ' + subject);
  const mailBody = encodeURIComponent(
    '이름 / 회사명: ' + name + '\n' +
    '연락처: ' + contact + '\n' +
    '문의 유형: ' + subject + '\n\n' +
    '문의 내용:\n' + message
  );

  // 네이버 메일 앱 딥링크 (모바일) / 네이버 메일 웹 (PC)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    // 네이버 메일 앱 딥링크 시도 후 실패 시 mailto로 폴백
    const naverScheme = 'navermail://compose?to=music2550%40naver.com&subject=' + mailSubject + '&body=' + mailBody;
    const fallback = 'mailto:music2550@naver.com?subject=' + mailSubject + '&body=' + mailBody;
    const start = Date.now();
    window.location.href = naverScheme;
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.location.href = fallback;
      }
    }, 1000);
  } else {
    // PC: 네이버 메일 웹 작성 페이지로 이동
    const naverWeb = 'https://mail.naver.com/write?to=music2550%40naver.com&subject=' + mailSubject + '&body=' + mailBody;
    window.open(naverWeb, '_blank');
  }
}

// --- Security Notice Popup (문의 내용 클릭 시) ---
(function () {
  const textarea = document.getElementById('message');
  const popup = document.getElementById('securityPopup');
  const closeBtn = document.getElementById('securityPopupClose');
  if (!textarea || !popup) return;

  let shown = false;

  textarea.addEventListener('focus', () => {
    if (shown) return;
    shown = true;
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closePopup() {
    popup.classList.remove('open');
    document.body.style.overflow = '';
    textarea.focus();
  }

  if (closeBtn) closeBtn.addEventListener('click', closePopup);

  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('open')) closePopup();
  });
})();

// --- Mobile View Overlay ---
(function () {
  const btn = document.getElementById('mobileViewBtn');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileOverlayClose');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    overlay.classList.add('open');
    btn.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeOverlay() {
    overlay.classList.remove('open');
    btn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });
})();

// --- Smooth Anchor Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
