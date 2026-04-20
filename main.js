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
      // HTML 포함 여부 판단: <가 있으면 innerHTML, 없으면 textContent
      if (t[key].includes('<') || key.endsWith('_html')) {
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

    // option 태그 번역
    document.querySelectorAll('option[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
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

// ============================================
//  추가 번역 키 패치 (전체 텍스트 커버)
// ============================================
(function() {
  const extra = {
    ko: {
      label_about: 'About Us', label_history: 'History',
      label_business: 'Business Overview', label_business2: 'Our Performance',
      label_capability: 'Our Performance', label_performance: 'Our Performance',
      label_contact: 'Contact',
      biz_sub: "급변하는 콘텐츠 시장 속, IP 제작의 가장 큰 허들 '음악 저작권'<br />㈜메이저세븐이엔엠은 제작자의 니즈를 충족하는 솔루션을 제시합니다.",
      biz1_title_html: 'Screening Work<br /><span>분석</span>',
      biz2_title_html: 'Clearance<br /><span>협의 및 해결</span>',
      biz3_title_html: 'Dispute & Response<br /><span>대응</span>',
      biz1_li1:'음악 저작물 권리 분석 및 리스크 파악', biz1_li2:'사용 유형 / Syndication 방식에 맞춘 범위 분류',
      biz1_li3:'사용자의 니즈에 맞는 사용료 견적 산출', biz1_li4:'권리사 / 권리자별 국내·외 Contact Point 파악',
      biz2_li1:'사용자의 니즈에 부합한 저작권 솔루션 프로세스', biz2_li2:'Global Standard에 맞춘 유형별 Clearance',
      biz2_li3:'Moral Right / Neighboring right / Cover / Syncronization / AR / SA / TR 등 사용 방식에 따른 조건 및 합리적인 승인로 협의',
      biz2_li4:'계약서 작성 및 법무 검토 대응, 체결',
      biz3_li1:'저작권 분쟁 유형별 대응 프로세스 지원', biz3_li2:'저작권 분쟁 전략 수립 및 대응', biz3_li3:'침해 제기 및 자문',
      tag_broadcast:'방송', tag_drama:'드라마', tag_ad:'광고', tag_game:'게임',
      tag_concert_s:'공연', tag_concert:'공연', tag_film:'영화', tag_youtube:'유튜브', tag_global:'글로벌 송출',
      tab_drama:'드라마', tab_trot:'트로트·크로스오버', tab_ballad:'발라드', tab_concert:'콘서트·예능', tab_content:'음원제작',
      perf_tab_kpop:'K-POP / 아이돌',
      cap_drama_title:'드라마', cap_drama_tagline:"드라마에서의 음악 저작권, <strong>'Context 이해'</strong>가 선행되어야 합니다.",
      cap_drama_footer:'드라마의 장면과 음악의 맥락을 연결하는 커뮤니케이션으로 <strong>창작 의도</strong>와 <strong>권리</strong> 사이의 균형을 동시에 보호합니다',
      cap_kpop_title:'K-POP 프로그램', cap_kpop_tagline:'K-POP 프로그램, <strong>저작권 대응력</strong>이 곧 경쟁력입니다.',
      cap_kpop_footer:'체계적이고 선제적인 대응으로 제작·편성·송출의 <strong>불확실성을 제거</strong>합니다',
      cap_trot_title:'트로트·크로스오버·글로벌 음악 프로그램', cap_trot_tagline:'세대와 장르를 아우르는 정밀한 <strong>저작권 권리 분석 역량</strong>',
      cap_trot_footer:'권리에 대한 정확한 이해와 음악적 전문성을 바탕으로 세대와 국경을 넘는 장르 융합의 리스크를 정밀하게 관리합니다',
      cap_ballad_title:'BALLAD 프로그램', cap_ballad_tagline:'<strong>리메이크 수요가 집중된</strong> 명곡 아카이브 정밀 대응 역량',
      cap_ballad_footer:'명곡을 향한 시장 수요와 권리 리스크 사이를 전략적으로 대응하는 전문 역량',
      cap_concert_title:'콘서트·시상식·리얼리티 예능 프로그램', cap_concert_tagline:'속도와 정확성을 동시에 요구하는 <strong>실시간 제작 환경</strong>에 최적화된 대응 전문성',
      cap_concert_footer:'실시간으로 급변하는 제작 사이클 속에서도 저작권의 빈틈이 남기지 않는 전문 대응 역량',
      col_kpop_complex:'복잡한 권리 구조', col_kpop_risk:'제작 리스크', col_solution_text:'메이저세븐이엔엠의 Solution',
      col_trot_senior:'원로 작가 및 승계 구조', col_trot_cover:'번안곡·원작 작품 권리 관계',
      col_ballad_demand:'8-90년대 명곡 수요 집중', col_ballad_conflict:'동시 사용 일정 충돌 리스크',
      col_concert_realtime:'실시간 변동 대응', col_concert_multi:'다수 권리자 통합 협의',
      perf_drama_tag:'기획부터 글로벌 송출까지 전 단계 클리어런스 수행',
      perf_drama_p1:'✓ 제작 단계별 권리 리스크 관리', perf_drama_p2:'✓ 장면, Context 기반 협상', perf_drama_p3:'✓ OTT 글로벌 송출 저작권 통합 대응',
      perf_kpop_avg:'이상 (최근 3년 평균)',
      perf_kpop_p1:'✓ 저작권 업무 및 리스크 대응', perf_kpop_p2:'✓ 채널 및 OTT 오리지널 다수', perf_kpop_p3:'✓ 글로벌 송출을 위한 사전 리스크 제거 등 전략적 대응 역량 보유',
      perf_trot_tag:'세대와 국경을 넘는 복합 권리 구조 정밀 해석',
      perf_trot_p1:'✓ 번안, Mash-up, 편곡 협의', perf_trot_p2:'✓ 국외 원저작자 현지 직접 협상', perf_trot_p3:'✓ 승계 양수 분산 구조 정밀 대응',
      perf_ballad_tag:'권리 변동 파악 및 이해관계 조울 역량',
      perf_ballad_p1:'✓ 명곡 클리어런스 다수 수행', perf_ballad_p2:'✓ 시장 수요 파악 및 전략적 조율', perf_ballad_p3:'✓ 선사용, 독점 조건 리스크 대응',
      perf_concert_tag:'실시간 제작 변수에 대한 즉각 대응 체계',
      perf_concert_p1:'✓ 셋리스트 변경 긴급 승인 대응', perf_concert_p2:'✓ 다수 권리자 협상 통합 관리', perf_concert_p3:'✓ 제작 일정에 맞춘 단계별 클리어런스 관리',
      perf_content_tag:'콘텐츠 제작 – 주요 추진 성과',
      hist1_title:'회사 설립', hist1_desc:'주식회사 메이저세븐이엔엠 창립. 음악 저작권 클리어런스 전문 에이전시로 출발',
      hist2_title:'공연 기획 및 제작', hist2_desc:'공연 분야 저작권 업무 확장, 라이브 공연·뮤지컬 등 공연 기획 및 제작 서비스 개시',
      hist3_title:'아티스트 및 콘텐츠 제작', hist3_desc:'아티스트 발굴·육성 및 음원·영상 콘텐츠 제작 사업 본격화',
      hist4_title:'음악 저작권 매니지먼트', hist4_desc:'저작권 매니지먼트 서비스 강화, 권리사 네트워크 확대 및 체계적 관리 시스템 구축',
      hist5_title:'글로벌 사업진출', hist5_desc:'글로벌 OTT·방송 시장 대응 역량 강화, 해외 권리사·에이전시와의 네트워크 본격 구축',
      opt_select:'선택해주세요', opt1:'저작권 클리어런스', opt2:'드라마·OTT 저작권', opt3:'K-POP / 아이돌 프로그램',
      opt4:'트로트·발라드 프로그램', opt5:'콘서트·예능·시상식', opt6:'콘텐츠 제작', opt7:'저작권 분쟁 대응', opt8:'기타',
    },
    en: {
      label_about:'About Us', label_history:'History', label_business:'Business Overview',
      label_business2:'Our Services', label_capability:'Our Expertise', label_performance:'Our Performance', label_contact:'Contact',
      biz_sub:"In a rapidly changing content market, music copyright is the biggest hurdle in IP production.<br />Major7 E&M presents solutions that meet producers' needs.",
      biz1_title_html:'Screening Work<br /><span>Analysis</span>',
      biz2_title_html:'Clearance<br /><span>Negotiation & Resolution</span>',
      biz3_title_html:'Dispute & Response<br /><span>Resolution</span>',
      biz1_li1:'Analysis of music rights and risk assessment', biz1_li2:'Scope classification by usage type and syndication method',
      biz1_li3:'Fee estimation tailored to the user\'s needs', biz1_li4:'Identifying domestic & international contact points per rights holder',
      biz2_li1:'Copyright solution process aligned with user needs', biz2_li2:'Genre-specific clearance to Global Standard',
      biz2_li3:'Negotiation of conditions and reasonable approval fees for Moral Right / Neighboring Right / Cover / Synchronization / AR / SA / TR, etc.',
      biz2_li4:'Contract drafting, legal review, and execution',
      biz3_li1:'Support for dispute response processes by type', biz3_li2:'Copyright dispute strategy planning and response', biz3_li3:'Infringement claims and advisory',
      tag_broadcast:'Broadcasting', tag_drama:'Drama', tag_ad:'Advertising', tag_game:'Gaming',
      tag_concert_s:'Concert', tag_concert:'Concert', tag_film:'Film', tag_youtube:'YouTube', tag_global:'Global Distribution',
      tab_drama:'Drama', tab_trot:'Trot · Crossover', tab_ballad:'Ballad', tab_concert:'Concert · Variety', tab_content:'Music Production',
      perf_tab_kpop:'K-POP / Idol',
      cap_drama_title:'Drama', cap_drama_tagline:"In drama, music copyright requires <strong>'understanding the context'</strong> first.",
      cap_drama_footer:'We protect the balance between <strong>creative intent</strong> and <strong>rights</strong> through communication that connects scene context with music.',
      cap_kpop_title:'K-POP Programs', cap_kpop_tagline:'In K-POP, <strong>copyright responsiveness</strong> is your competitive edge.',
      cap_kpop_footer:'Through systematic and preemptive responses, we <strong>eliminate uncertainty</strong> in production, scheduling, and distribution.',
      cap_trot_title:'Trot · Crossover · Global Music Programs', cap_trot_tagline:'Precise <strong>rights analysis expertise</strong> spanning generations and genres.',
      cap_trot_footer:'We precisely manage genre fusion risks across generations and borders with deep understanding of rights and musical expertise.',
      cap_ballad_title:'BALLAD Programs', cap_ballad_tagline:'<strong>Focused on remake demand</strong> — precision response for classic song archives.',
      cap_ballad_footer:'Specialized expertise in strategically navigating market demand for classics against rights risks.',
      cap_concert_title:'Concert · Awards · Reality Variety Programs', cap_concert_tagline:'Expertise optimized for <strong>real-time production environments</strong> requiring both speed and accuracy.',
      cap_concert_footer:'Expert response capabilities that leave no gaps in copyright even within rapidly changing production cycles.',
      col_kpop_complex:'Complex Rights Structure', col_kpop_risk:'Production Risks', col_solution_text:'Major7 E&M\'s Solution',
      col_trot_senior:'Senior Authors & Succession Structures', col_trot_cover:'Cover Song & Original Rights Relationships',
      col_ballad_demand:'Concentrated Demand for 80-90s Classics', col_ballad_conflict:'Simultaneous Use Schedule Conflict Risk',
      col_concert_realtime:'Real-time Change Response', col_concert_multi:'Consolidated Multi-Rights-Holder Negotiation',
      perf_drama_tag:'Full-stage clearance from planning to global distribution',
      perf_drama_p1:'✓ Stage-by-stage rights risk management', perf_drama_p2:'✓ Scene & context-based negotiation', perf_drama_p3:'✓ Integrated copyright response for OTT global distribution',
      perf_kpop_avg:'or more (3-year average)',
      perf_kpop_p1:'✓ Copyright management & risk response', perf_kpop_p2:'✓ Multiple channel & OTT originals', perf_kpop_p3:'✓ Pre-emptive risk elimination for global distribution',
      perf_trot_tag:'Precise analysis of complex rights structures across generations and borders',
      perf_trot_p1:'✓ Negotiation for covers, mash-ups, and arrangements', perf_trot_p2:'✓ Direct overseas original rights holder negotiations', perf_trot_p3:'✓ Precision response to distributed succession structures',
      perf_ballad_tag:'Rights change tracking and stakeholder coordination expertise',
      perf_ballad_p1:'✓ Multiple classic song clearances performed', perf_ballad_p2:'✓ Market demand analysis and strategic coordination', perf_ballad_p3:'✓ Prior use and exclusivity risk response',
      perf_concert_tag:'Immediate response system for real-time production variables',
      perf_concert_p1:'✓ Emergency setlist change approval response', perf_concert_p2:'✓ Integrated management of multi-rights-holder negotiations', perf_concert_p3:'✓ Stage-by-stage clearance management aligned with production schedule',
      perf_content_tag:'Content Production – Key Achievements',
      hist1_title:'Founded', hist1_desc:'Established Major7 E&M as a specialized music copyright clearance agency',
      hist2_title:'Concert Planning & Production', hist2_desc:'Expanded into concert copyright services; launched live performance and musical planning',
      hist3_title:'Artist & Content Production', hist3_desc:'Full launch of artist development and music/video content production',
      hist4_title:'Music Copyright Management', hist4_desc:'Strengthened copyright management services and expanded rights holder network',
      hist5_title:'Global Business Expansion', hist5_desc:'Enhanced capabilities for global OTT & broadcasting markets; built overseas agency network',
      opt_select:'Please select', opt1:'Copyright Clearance', opt2:'Drama · OTT Copyright', opt3:'K-POP / Idol Programs',
      opt4:'Trot · Ballad Programs', opt5:'Concert · Variety · Awards', opt6:'Content Production', opt7:'Copyright Dispute', opt8:'Other',
    },
    ja: {
      label_about:'About Us', label_history:'History', label_business:'Business Overview',
      label_business2:'Our Services', label_capability:'Our Expertise', label_performance:'Our Performance', label_contact:'Contact',
      biz_sub:'急変するコンテンツ市場において、IP制作最大のハードル「音楽著作権」<br />メジャーセブンE&Mは制作者のニーズを満たすソリューションを提案します。',
      biz1_title_html:'Screening Work<br /><span>分析</span>',
      biz2_title_html:'Clearance<br /><span>交渉・解決</span>',
      biz3_title_html:'Dispute & Response<br /><span>対応</span>',
      biz1_li1:'音楽著作物の権利分析とリスク把握', biz1_li2:'使用タイプ/シンジケーション方式に応じた範囲分類',
      biz1_li3:'ユーザーニーズに合わせた使用料見積もり', biz1_li4:'権利者別の国内外コンタクトポイント把握',
      biz2_li1:'ユーザーニーズに沿った著作権ソリューションプロセス', biz2_li2:'グローバルスタンダードに沿った種別Clearance',
      biz2_li3:'Moral Right / Neighboring Right / カバー / Synchronization / AR / SA / TR等の条件・承認料交渉',
      biz2_li4:'契約書作成・法務審査対応・締結',
      biz3_li1:'著作権紛争タイプ別対応プロセス支援', biz3_li2:'著作権紛争戦略立案と対応', biz3_li3:'侵害申立てとアドバイザリー',
      tag_broadcast:'放送', tag_drama:'ドラマ', tag_ad:'広告', tag_game:'ゲーム',
      tag_concert_s:'コンサート', tag_concert:'コンサート', tag_film:'映画', tag_youtube:'YouTube', tag_global:'グローバル配信',
      tab_drama:'ドラマ', tab_trot:'トロット・クロスオーバー', tab_ballad:'バラード', tab_concert:'コンサート・バラエティ', tab_content:'音源制作',
      perf_tab_kpop:'K-POP / アイドル',
      cap_drama_title:'ドラマ', cap_drama_tagline:"ドラマにおける音楽著作権は、<strong>「Contextの理解」</strong>が先行されなければなりません。",
      cap_drama_footer:'場面と音楽のコンテキストをつなぐコミュニケーションで、<strong>創作意図</strong>と<strong>権利</strong>のバランスを同時に守ります',
      cap_kpop_title:'K-POPプログラム', cap_kpop_tagline:'K-POPプログラムでは、<strong>著作権対応力</strong>が競争力そのものです。',
      cap_kpop_footer:'体系的・先制的な対応で制作・編成・配信の<strong>不確実性を排除</strong>します',
      cap_trot_title:'トロット・クロスオーバー・グローバル音楽プログラム', cap_trot_tagline:'世代とジャンルをまたぐ精密な<strong>著作権権利分析能力</strong>',
      cap_trot_footer:'権利への正確な理解と音楽的専門性をもとに、世代と国境を越えるジャンル融合のリスクを精密に管理します',
      cap_ballad_title:'BALLADプログラム', cap_ballad_tagline:'<strong>リメイク需要が集中する</strong>名曲アーカイブへの精密対応能力',
      cap_ballad_footer:'名曲への市場需要と権利リスクの間を戦略的に対応する専門能力',
      cap_concert_title:'コンサート・授賞式・リアリティ番組', cap_concert_tagline:'スピードと正確性を同時に求める<strong>リアルタイム制作環境</strong>に特化した対応専門性',
      cap_concert_footer:'急変する制作サイクルの中でも著作権の穴を残さない専門対応能力',
      col_kpop_complex:'複雑な権利構造', col_kpop_risk:'制作リスク', col_solution_text:'メジャーセブンE&Mのソリューション',
      col_trot_senior:'原老作家・承継構造', col_trot_cover:'翻案曲・原作品の権利関係',
      col_ballad_demand:'80〜90年代名曲への需要集中', col_ballad_conflict:'同時使用スケジュール衝突リスク',
      col_concert_realtime:'リアルタイム変動対応', col_concert_multi:'複数権利者統合交渉',
      perf_drama_tag:'企画からグローバル配信まで全段階クリアランス実施',
      perf_drama_p1:'✓ 制作段階別権利リスク管理', perf_drama_p2:'✓ 場面・コンテキスト基準の交渉', perf_drama_p3:'✓ OTTグローバル配信著作権統合対応',
      perf_kpop_avg:'以上（直近3年平均）',
      perf_kpop_p1:'✓ 著作権業務・リスク対応', perf_kpop_p2:'✓ 複数チャンネル・OTTオリジナル多数', perf_kpop_p3:'✓ グローバル配信に向けた事前リスク除去等の戦略的対応',
      perf_trot_tag:'世代と国境を越える複合権利構造の精密解析',
      perf_trot_p1:'✓ 翻案・マッシュアップ・編曲交渉', perf_trot_p2:'✓ 海外原著作者との現地直接交渉', perf_trot_p3:'✓ 分散承継構造への精密対応',
      perf_ballad_tag:'権利変動把握と利害関係者調整能力',
      perf_ballad_p1:'✓ 名曲クリアランス多数実施', perf_ballad_p2:'✓ 市場需要把握と戦略的調整', perf_ballad_p3:'✓ 先使用・独占条件リスク対応',
      perf_concert_tag:'リアルタイム制作変数への即応体制',
      perf_concert_p1:'✓ セットリスト変更緊急承認対応', perf_concert_p2:'✓ 複数権利者交渉の統合管理', perf_concert_p3:'✓ 制作スケジュールに合わせた段階的クリアランス管理',
      perf_content_tag:'コンテンツ制作 – 主な実績',
      hist1_title:'会社設立', hist1_desc:'㈱メジャーセブンE&M設立。音楽著作権クリアランス専門エージェンシーとしてスタート',
      hist2_title:'公演企画・制作', hist2_desc:'公演分野著作権業務を拡大。ライブ・ミュージカル等の公演企画・制作サービス開始',
      hist3_title:'アーティスト・コンテンツ制作', hist3_desc:'アーティスト発掘・育成および音源・映像コンテンツ制作事業を本格化',
      hist4_title:'音楽著作権マネジメント', hist4_desc:'著作権マネジメントサービスを強化、権利者ネットワーク拡大と体系的管理システム構築',
      hist5_title:'グローバル事業進出', hist5_desc:'グローバルOTT・放送市場への対応力を強化、海外エージェンシーとのネットワーク本格構築',
      opt_select:'選択してください', opt1:'著作権クリアランス', opt2:'ドラマ・OTT著作権', opt3:'K-POP / アイドル番組',
      opt4:'トロット・バラード番組', opt5:'コンサート・バラエティ・授賞式', opt6:'コンテンツ制作', opt7:'著作権紛争対応', opt8:'その他',
    },
    zh: {
      label_about:'关于我们', label_history:'发展历程', label_business:'业务概览',
      label_business2:'我们的服务', label_capability:'专业能力', label_performance:'主要业绩', label_contact:'联系我们',
      biz_sub:'在瞬息万变的内容市场中，音乐版权是IP制作最大的难关。<br />Major7 E&M为制作方提供满足需求的解决方案。',
      biz1_title_html:'Screening Work<br /><span>分析</span>',
      biz2_title_html:'Clearance<br /><span>协商与解决</span>',
      biz3_title_html:'Dispute & Response<br /><span>应对</span>',
      biz1_li1:'音乐著作物权利分析及风险评估', biz1_li2:'按使用类型/联播方式划分范围',
      biz1_li3:'根据用户需求估算使用费', biz1_li4:'掌握各权利方国内外联系渠道',
      biz2_li1:'符合用户需求的版权解决方案流程', biz2_li2:'按国际标准分类进行许可',
      biz2_li3:'就精神权利/邻接权/翻唱/同步权/AR/SA/TR等使用条件及合理许可费进行协商',
      biz2_li4:'合同起草、法律审查与签署',
      biz3_li1:'按类型提供版权纠纷应对流程支持', biz3_li2:'制定版权纠纷策略并应对', biz3_li3:'侵权主张及咨询服务',
      tag_broadcast:'广播', tag_drama:'影视', tag_ad:'广告', tag_game:'游戏',
      tag_concert_s:'演出', tag_concert:'演出', tag_film:'电影', tag_youtube:'YouTube', tag_global:'全球发行',
      tab_drama:'影视', tab_trot:'Trot·跨界', tab_ballad:'抒情曲', tab_concert:'演唱会·综艺', tab_content:'音乐制作',
      perf_tab_kpop:'K-POP / 偶像',
      cap_drama_title:'影视', cap_drama_tagline:'影视中的音乐版权，需要优先<strong>「理解Context」</strong>。',
      cap_drama_footer:'通过将场景与音乐脉络相连接的沟通，同时保护<strong>创作意图</strong>与<strong>权利</strong>之间的平衡',
      cap_kpop_title:'K-POP节目', cap_kpop_tagline:'K-POP节目中，<strong>版权应对能力</strong>即是竞争力。',
      cap_kpop_footer:'通过系统性、先发制人的应对，<strong>消除</strong>制作、编排与发行中的<strong>不确定性</strong>',
      cap_trot_title:'Trot·跨界·全球音乐节目', cap_trot_tagline:'跨越世代与流派的精准<strong>版权权利分析能力</strong>',
      cap_trot_footer:'基于对权利的精准理解与音乐专业性，精密管理跨越世代与国境的流派融合风险',
      cap_ballad_title:'BALLAD节目', cap_ballad_tagline:'<strong>翻唱需求集中</strong>——经典曲目档案的精准应对能力',
      cap_ballad_footer:'在经典曲目市场需求与版权风险之间进行战略性应对的专业能力',
      cap_concert_title:'演唱会·颁奖典礼·真人秀节目', cap_concert_tagline:'专为<strong>实时制作环境</strong>优化，同时要求速度与精准度的专业应对能力',
      cap_concert_footer:'即使在瞬息万变的制作周期中也不留版权漏洞的专业应对能力',
      col_kpop_complex:'复杂的权利结构', col_kpop_risk:'制作风险', col_solution_text:'Major7 E&M的解决方案',
      col_trot_senior:'资深作者与继承结构', col_trot_cover:'翻唱曲与原作品的权利关系',
      col_ballad_demand:'80-90年代经典曲目需求集中', col_ballad_conflict:'同期使用时间表冲突风险',
      col_concert_realtime:'实时变动应对', col_concert_multi:'多权利方综合协商',
      perf_drama_tag:'从策划到全球发行的全阶段版权许可',
      perf_drama_p1:'✓ 按制作阶段进行权利风险管理', perf_drama_p2:'✓ 基于场景与Context的协商', perf_drama_p3:'✓ OTT全球发行版权综合应对',
      perf_kpop_avg:'以上（近3年平均）',
      perf_kpop_p1:'✓ 版权事务及风险应对', perf_kpop_p2:'✓ 多家频道及OTT原创项目', perf_kpop_p3:'✓ 全球发行前期风险消除等战略应对能力',
      perf_trot_tag:'跨越世代与国境的复合权利结构精准解析',
      perf_trot_p1:'✓ 翻唱、混搭、编曲协商', perf_trot_p2:'✓ 与海外原著作人直接谈判', perf_trot_p3:'✓ 分散继承结构精准应对',
      perf_ballad_tag:'权利变动把握与利益相关方协调能力',
      perf_ballad_p1:'✓ 多项经典曲目版权许可实绩', perf_ballad_p2:'✓ 市场需求把握与战略协调', perf_ballad_p3:'✓ 先用权与独占条件风险应对',
      perf_concert_tag:'针对实时制作变量的即时应对体系',
      perf_concert_p1:'✓ 歌单变更紧急审批应对', perf_concert_p2:'✓ 多权利方谈判综合管理', perf_concert_p3:'✓ 与制作进度匹配的分阶段版权许可管理',
      perf_content_tag:'内容制作 – 主要成果',
      hist1_title:'公司成立', hist1_desc:'Major7 E&M成立，以专业音乐版权许可代理机构为起点',
      hist2_title:'演出策划与制作', hist2_desc:'扩展至演出版权业务，开始提供现场演出及音乐剧策划制作服务',
      hist3_title:'艺人及内容制作', hist3_desc:'正式开展艺人发掘培养及音源、视频内容制作业务',
      hist4_title:'音乐版权管理', hist4_desc:'强化版权管理服务，扩大权利方网络并构建系统化管理体系',
      hist5_title:'全球业务拓展', hist5_desc:'加强全球OTT及广播市场应对能力，正式构建海外代理网络',
      opt_select:'请选择', opt1:'版权许可', opt2:'影视·OTT版权', opt3:'K-POP / 偶像节目',
      opt4:'Trot·抒情曲节目', opt5:'演唱会·综艺·颁奖典礼', opt6:'内容制作', opt7:'版权纠纷应对', opt8:'其他',
    }
  };

  // 기존 i18nData에 병합
  for (const lang in extra) {
    Object.assign(i18nData[lang], extra[lang]);
  }

  // option 태그 번역을 위한 applyTranslations 재실행 패치
  const _orig = window._i18nApply;
})();
