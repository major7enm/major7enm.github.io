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
  const elements = document.querySelectorAll('.section-title, .section-label, .about-desc, .info-row, .value-card, .business-card, .timeline-item, .capability-card, .perf-meta, .prog-item, .perf-item, .contact-form, .contact-info, .yt-placeholder');

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

// ============================================
//  INTERNATIONALIZATION (i18n)
// ============================================

const i18nData = {
  ko: {
    meta_title: '주식회사 메이저세븐이엔엠 | Major7 Entertainment & Music Copyright Inc.',
    nav_about: '회사 소개',
    nav_business: '사업 분야',
    nav_capability: '대응역량',
    nav_performance: '주요 성과',
    nav_contact: '문의하기',
    mobile_view: '모바일 뷰',
    hero_badge: 'Music Copyright Clearance Agency',
    hero_title_html: '콘텐츠의 글로벌<br /><span class="hero-accent">IP 비상</span>을 가능케 하는<br />최적의 파트너',
    hero_desc_html: '방송 · 드라마 · 광고 · 게임 등 다양한 장르에서<br />음악저작물을 <strong>합리적인 비용</strong>으로 <strong>안전하게</strong> 이용할 수 있도록<br />전문적이고 체계적인 프로세스를 제공합니다.',
    hero_cta_business: '사업 분야 보기',
    stat_founded: '설립연도',
    stat_years_unit: '년+',
    stat_experience: '전문 경력',
    stat_clearance: '클리어런스 성공률',
    scroll_hint: '스크롤',
    yt_label: 'Channel',
    yt_title: 'Major7 E&M 채널',
    yt_desc: '음악 저작권의 최신 트렌드와 인사이트를 영상으로 만나보세요.',
    yt_placeholder: '영상이 곧 업로드됩니다. 채널을 구독해 주세요!',
    yt_channel_btn: '채널 방문하기',
    about_title_html: '국내 최고의<br />음악 저작권<br /><span class="text-accent">클리어런스 에이전시</span>',
    about_desc: '㈜ 메이저세븐이엔엠은 사용자가 방송·드라마·광고·게임 등 다양한 장르에서 필요한 음악저작물을 합리적인 비용으로 안전하게 이용할 수 있도록 콘텐츠 제작 전반의 이해도와 실무 경험을 바탕으로 전문적이고 체계적인 프로세스를 제공합니다.',
    info_company: '기업명',
    info_founded_label: '설립일',
    info_founded_val: '2009년 9월',
    info_ceo: '대표이사',
    info_business: '사업분야',
    info_business_val: '음악 저작권 관리, 저작권 컨설팅, 정보 서비스, 콘텐츠 기획 및 제작',
    info_address: '주소',
    mission_text: '"합리적인 비용과 전문적이고 체계적인 솔루션을 제공함으로써 콘텐츠의 글로벌 IP 비상을 가능케 하는 최적의 파트너, Major7 E&M"',
    val1_title: '신뢰성', val1_desc: '검증된 네트워크와 실무 경험으로 확실한 결과를 보장합니다',
    val2_title: '전문성', val2_desc: '15년 이상의 음악 저작권 실무 역량과 글로벌 네트워크',
    val3_title: '책임감', val3_desc: '프로젝트 시작부터 완료까지 일관된 책임감으로 대응합니다',
    val4_title: '글로벌', val4_desc: '국내외 권리사 네트워크를 통한 글로벌 클리어런스 수행',
    history_title: '15년의 전문 역사',
    biz_title: '저작권 Clearance',
    cap_title: '장르별 대응역량',
    cap_sub: '각 콘텐츠 장르의 특성을 깊이 이해하고 맞춤형 솔루션을 제공합니다',
    perf_title: '주요 성과',
    perf_sub: '국내 주요 채널 및 OTT 오리지널 콘텐츠 클리어런스 전담 수행',
    contact_title_html: '저작권 문제,<br />저희에게<br /><span class="text-gold">맡겨주세요</span>',
    contact_desc: '음악 저작권 클리어런스부터 콘텐츠 제작까지<br />전문가팀이 신속하고 정확하게 도와드립니다.',
    form_name: '이름 / 회사명',
    form_name_ph: '홍길동 / ㈜OO엔터테인먼트',
    form_contact: '연락처',
    form_contact_ph: '이메일 또는 전화번호',
    form_subject: '문의 유형',
    form_message: '문의 내용',
    form_message_ph: '프로젝트 개요, 사용 장르, 일정 등을 간략히 적어주세요.',
    form_submit: '문의 보내기',
    security_note: '보안상 개인 이메일로 다시 메일을 보내주세요. 감사합니다.',
    form_note: '* 버튼을 누르면 네이버 메일이 열립니다. 전송 후 빠른 시일 내에 회신드립니다.',
    footer_services: '음악 저작권 클리어런스 | 리스크 관리 | 저작권 정보 서비스 | 콘텐츠 기획 및 제작',
    popup_title: '보안 안내',
    popup_msg_html: '보안상 개인 이메일로<br>다시 메일을 보내주세요.<br><br>감사합니다.',
    popup_confirm: '확인',
  },

  en: {
    meta_title: 'Major7 E&M | Music Copyright Clearance Agency',
    nav_about: 'About',
    nav_business: 'Business',
    nav_capability: 'Expertise',
    nav_performance: 'Portfolio',
    nav_contact: 'Contact',
    mobile_view: 'Mobile View',
    hero_badge: 'Music Copyright Clearance Agency',
    hero_title_html: 'The Optimal Partner<br />for <span class="hero-accent">Global IP</span><br />Content Success',
    hero_desc_html: 'From broadcasting to drama, advertising and games —<br />we provide expert and systematic processes to ensure<br /><strong>safe and cost-effective</strong> use of music rights.',
    hero_cta_business: 'Our Services',
    stat_founded: 'Founded',
    stat_years_unit: 'yrs+',
    stat_experience: 'Experience',
    stat_clearance: 'Clearance Rate',
    scroll_hint: 'Scroll',
    yt_label: 'Channel',
    yt_title: 'Major7 E&M Channel',
    yt_desc: 'Discover the latest trends and insights in music copyright through our videos.',
    yt_placeholder: 'Videos coming soon. Subscribe to our channel!',
    yt_channel_btn: 'Visit Channel',
    about_title_html: "Korea's Premier<br />Music Copyright<br /><span class=\"text-accent\">Clearance Agency</span>",
    about_desc: 'Major7 E&M provides professional and systematic processes based on deep understanding of content production and practical experience, enabling clients to use music in broadcasting, drama, advertising, games and more — safely and at a reasonable cost.',
    info_company: 'Company',
    info_founded_label: 'Founded',
    info_founded_val: 'September 2009',
    info_ceo: 'CEO',
    info_business: 'Business',
    info_business_val: 'Music Copyright Management, Copyright Consulting, Information Services, Content Planning & Production',
    info_address: 'Address',
    mission_text: '"The optimal partner enabling the global IP soar of content through reasonable costs and professional, systematic solutions — Major7 E&M"',
    val1_title: 'Reliability', val1_desc: 'Guaranteed results backed by a verified network and hands-on expertise',
    val2_title: 'Expertise', val2_desc: '15+ years of music copyright experience with a global network',
    val3_title: 'Accountability', val3_desc: 'Consistent responsibility from project start to finish',
    val4_title: 'Global', val4_desc: 'Global clearance through domestic & international rights-holder networks',
    history_title: '15 Years of Professional History',
    biz_title: 'Copyright Clearance',
    cap_title: 'Genre Expertise',
    cap_sub: 'We deliver tailored solutions with deep understanding of each content genre',
    perf_title: 'Portfolio',
    perf_sub: 'Leading clearance services for major channels and OTT originals',
    contact_title_html: 'Leave Your<br />Copyright Issues<br /><span class="text-gold">to Us</span>',
    contact_desc: 'From music copyright clearance to content production,<br />our expert team responds swiftly and accurately.',
    form_name: 'Name / Company',
    form_name_ph: 'John Doe / ABC Entertainment',
    form_contact: 'Contact',
    form_contact_ph: 'Email or phone number',
    form_subject: 'Inquiry Type',
    form_message: 'Message',
    form_message_ph: 'Briefly describe your project, genre, and timeline.',
    form_submit: 'Send Inquiry',
    security_note: 'For security, please resend your inquiry to our personal email. Thank you.',
    form_note: '* Clicking the button opens Naver Mail. We will reply promptly after submission.',
    footer_services: 'Music Copyright Clearance | Risk Management | Copyright Information Services | Content Planning & Production',
    popup_title: 'Security Notice',
    popup_msg_html: 'For security purposes, please<br>also send your inquiry<br>to our personal email.<br><br>Thank you.',
    popup_confirm: 'Confirm',
  },

  ja: {
    meta_title: 'メジャーセブンE&M | 音楽著作権クリアランスエージェンシー',
    nav_about: '会社紹介',
    nav_business: '事業分野',
    nav_capability: '対応能力',
    nav_performance: '主な実績',
    nav_contact: 'お問い合わせ',
    mobile_view: 'モバイル表示',
    hero_badge: 'Music Copyright Clearance Agency',
    hero_title_html: 'コンテンツの<br /><span class="hero-accent">グローバルIP飛躍</span>を<br />実現する最適パートナー',
    hero_desc_html: '放送・ドラマ・広告・ゲームなど様々なジャンルで<br />音楽著作物を<strong>合理的なコスト</strong>で<strong>安全に</strong>ご利用いただけるよう<br />専門的で体系的なプロセスをご提供します。',
    hero_cta_business: '事業分野を見る',
    stat_founded: '設立年度',
    stat_years_unit: '年+',
    stat_experience: '専門経験',
    stat_clearance: 'クリアランス成功率',
    scroll_hint: 'スクロール',
    yt_label: 'チャンネル',
    yt_title: 'Major7 E&M チャンネル',
    yt_desc: '音楽著作権の最新トレンドとインサイトを動画でご覧ください。',
    yt_placeholder: '動画は近日公開予定です。チャンネル登録をお願いします！',
    yt_channel_btn: 'チャンネルを見る',
    about_title_html: '韓国トップクラスの<br />音楽著作権<br /><span class="text-accent">クリアランスエージェンシー</span>',
    about_desc: 'メジャーセブンE&Mは、放送・ドラマ・広告・ゲームなど様々なジャンルで必要な音楽著作物を合理的なコストで安全にご利用いただけるよう、コンテンツ制作全般の理解と実務経験に基づいた専門的かつ体系的なプロセスをご提供します。',
    info_company: '会社名',
    info_founded_label: '設立日',
    info_founded_val: '2009年9月',
    info_ceo: '代表取締役',
    info_business: '事業分野',
    info_business_val: '音楽著作権管理、著作権コンサルティング、情報サービス、コンテンツ企画・制作',
    info_address: '住所',
    mission_text: '「合理的なコストと専門的・体系的なソリューションを提供し、コンテンツのグローバルIP飛躍を実現する最適パートナー、Major7 E&M」',
    val1_title: '信頼性', val1_desc: '検証されたネットワークと実務経験で確かな結果をお約束します',
    val2_title: '専門性', val2_desc: '15年以上の音楽著作権実務能力とグローバルネットワーク',
    val3_title: '責任感', val3_desc: 'プロジェクト開始から完了まで一貫した責任感で対応します',
    val4_title: 'グローバル', val4_desc: '国内外の権利者ネットワークを通じたグローバルクリアランス',
    history_title: '15年の専門的な歴史',
    biz_title: '著作権クリアランス',
    cap_title: 'ジャンル別対応能力',
    cap_sub: '各コンテンツジャンルの特性を深く理解し、カスタマイズされたソリューションをご提供します',
    perf_title: '主な実績',
    perf_sub: '国内主要チャンネル及びOTTオリジナルコンテンツのクリアランスを専任実施',
    contact_title_html: '著作権の問題は<br />私たちに<br /><span class="text-gold">お任せください</span>',
    contact_desc: '音楽著作権クリアランスからコンテンツ制作まで<br />専門家チームが迅速かつ正確にサポートします。',
    form_name: '氏名 / 会社名',
    form_name_ph: '山田太郎 / ○○エンターテインメント',
    form_contact: '連絡先',
    form_contact_ph: 'メールアドレスまたは電話番号',
    form_subject: 'お問い合わせ種類',
    form_message: 'お問い合わせ内容',
    form_message_ph: 'プロジェクト概要、使用ジャンル、スケジュールなどをご記入ください。',
    form_submit: '送信する',
    security_note: 'セキュリティのため、個人メールにも再度ご連絡ください。ありがとうございます。',
    form_note: '* ボタンを押すとNaverメールが開きます。送信後、速やかにご返信いたします。',
    footer_services: '音楽著作権クリアランス | リスク管理 | 著作権情報サービス | コンテンツ企画・制作',
    popup_title: 'セキュリティのご案内',
    popup_msg_html: 'セキュリティのため、<br>個人メールにも<br>ご連絡をお願いします。<br><br>ありがとうございます。',
    popup_confirm: '確認',
  },

  zh: {
    meta_title: 'Major7 E&M | 音乐版权许可代理机构',
    nav_about: '公司介绍',
    nav_business: '业务领域',
    nav_capability: '专业能力',
    nav_performance: '主要业绩',
    nav_contact: '联系我们',
    mobile_view: '手机版',
    hero_badge: '音乐版权许可代理机构',
    hero_title_html: '助力内容<br /><span class="hero-accent">全球IP腾飞</span><br />的最佳合作伙伴',
    hero_desc_html: '从广播、影视、广告到游戏，各类媒体领域<br />以<strong>合理的成本</strong><strong>安全合规</strong>地使用音乐作品<br />我们提供专业、系统化的解决方案。',
    hero_cta_business: '查看业务领域',
    stat_founded: '成立年份',
    stat_years_unit: '年+',
    stat_experience: '专业经验',
    stat_clearance: '许可成功率',
    scroll_hint: '滚动',
    yt_label: '频道',
    yt_title: 'Major7 E&M 频道',
    yt_desc: '通过视频了解音乐版权的最新趋势与深度见解。',
    yt_placeholder: '视频即将上传，请订阅我们的频道！',
    yt_channel_btn: '访问频道',
    about_title_html: '韩国顶级<br />音乐版权<br /><span class="text-accent">许可代理机构</span>',
    about_desc: 'Major7 E&M凭借对内容制作的深刻理解和丰富实践经验，为广播、影视、广告、游戏等各类领域的音乐版权许可提供专业、系统化的流程，确保客户以合理成本安全使用音乐作品。',
    info_company: '公司名称',
    info_founded_label: '成立日期',
    info_founded_val: '2009年9月',
    info_ceo: '首席执行官',
    info_business: '业务范围',
    info_business_val: '音乐版权管理、版权咨询、信息服务、内容策划与制作',
    info_address: '地址',
    mission_text: '"通过提供合理的成本与专业系统化的解决方案，成为助力内容全球IP腾飞的最佳合作伙伴——Major7 E&M"',
    val1_title: '可靠性', val1_desc: '依托经过验证的网络和实践经验，保障切实可靠的成果',
    val2_title: '专业性', val2_desc: '15年以上音乐版权实务经验与全球合作网络',
    val3_title: '责任心', val3_desc: '从项目启动到完成，始终以一贯的责任感全程跟进',
    val4_title: '全球化', val4_desc: '通过国内外版权方网络，执行全球化版权许可',
    history_title: '15年专业发展历程',
    biz_title: '版权许可服务',
    cap_title: '按类型分类的专业能力',
    cap_sub: '深入理解各内容类型的特点，提供量身定制的解决方案',
    perf_title: '主要业绩',
    perf_sub: '承担国内主要频道及OTT原创内容的版权许可专项工作',
    contact_title_html: '版权问题<br />请交给<br /><span class="text-gold">我们来解决</span>',
    contact_desc: '从音乐版权许可到内容制作<br />专业团队迅速准确地为您提供全方位支持。',
    form_name: '姓名 / 公司名',
    form_name_ph: '张三 / ○○娱乐公司',
    form_contact: '联系方式',
    form_contact_ph: '电子邮件或电话号码',
    form_subject: '咨询类型',
    form_message: '咨询内容',
    form_message_ph: '请简要描述您的项目概况、使用类型及时间安排。',
    form_submit: '发送咨询',
    security_note: '出于安全考虑，请同时将邮件发送至我们的个人邮箱。谢谢。',
    form_note: '* 点击按钮将打开Naver邮件。提交后我们将尽快回复您。',
    footer_services: '音乐版权许可 | 风险管理 | 版权信息服务 | 内容策划与制作',
    popup_title: '安全提示',
    popup_msg_html: '出于安全考虑，<br>请同时将您的咨询<br>发送至我们的个人邮箱。<br><br>谢谢您。',
    popup_confirm: '确认',
  }
};

// --- Language Switcher ---
(function () {
  let currentLang = 'ko';

  function applyTranslations(lang) {
    const t = i18nData[lang];
    if (!t) return;

    currentLang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);

    // 언어 레이블 업데이트
    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = lang.toUpperCase();

    // 드롭다운 active 상태
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('.mobile-lang-opt').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 텍스트 노드 번역
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!t[key]) return;
      // HTML이 포함된 키 (hero_title_html 등)
      if (key.endsWith('_html') || key === 'mission_text' || key === 'about_title_html' || key === 'contact_title_html') {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    });

    // placeholder 번역
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) el.setAttribute('placeholder', t[key]);
    });

    // 문서 제목
    if (t.meta_title) document.title = t.meta_title;
  }

  // 드롭다운 토글
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const langSwitcher = document.getElementById('langSwitcher');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langDropdown.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', isOpen);
    });

    // 드롭다운 옵션 클릭
    langDropdown.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', () => {
        applyTranslations(btn.dataset.lang);
        langDropdown.classList.remove('open');
        langBtn.setAttribute('aria-expanded', false);
      });
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (langSwitcher && !langSwitcher.contains(e.target)) {
        langDropdown.classList.remove('open');
        langBtn.setAttribute('aria-expanded', false);
      }
    });
  }

  // 모바일 언어 버튼
  document.querySelectorAll('.mobile-lang-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTranslations(btn.dataset.lang);
      // 모바일 메뉴 닫기
      const menu = document.getElementById('mobileMenu');
      const hamburger = document.getElementById('hamburger');
      if (menu) {
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', true);
      }
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', false);
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  });

  // 초기 언어 적용
  applyTranslations(currentLang);
})();
