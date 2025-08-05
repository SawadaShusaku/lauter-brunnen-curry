// リキッドグラスエフェクトのマウス追従
function initLiquidEffect() {
  document.querySelectorAll('.nav-link').forEach(link => {
    // マウス移動時の処理
    const handleMouseMove = (e) => {
      const rect = link.getBoundingClientRect();
      // マウス位置が要素の範囲内かチェック
      const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
      const y = Math.min(Math.max(0, e.clientY - rect.top), rect.height);
      link.style.setProperty('--x', `${x}px`);
      link.style.setProperty('--y', `${y}px`);
    };

    // マウスが要素から出た時の処理
    const handleMouseLeave = () => {
      // 要素の中心にエフェクトを戻す
      const rect = link.getBoundingClientRect();
      link.style.setProperty('--x', `${rect.width / 2}px`);
      link.style.setProperty('--y', `${rect.height / 2}px`);
    };

    link.addEventListener('mousemove', handleMouseMove);
    link.addEventListener('mouseleave', handleMouseLeave);

    // 初期位置を中心に設定
    handleMouseLeave();
  });
}

// モバイルメニューの切り替え
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// スクロール位置に応じてナビゲーションのフォーカスを更新
function updateActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // ビューポートの中心位置を計算
  const viewportCenter = window.scrollY + (window.innerHeight / 3);

  // 現在のセクションを特定
  let currentSection = null;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
      currentSection = section;
    }
  });

  // ナビゲーションリンクのアクティブ状態を更新
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentSection && href === `#${currentSection.id}`) {
      link.setAttribute('data-active', 'true');
      // エフェクト位置を設定
      const rect = link.getBoundingClientRect();
      const isMobile = window.innerWidth < 768; // Tailwindのmd:ブレークポイントと同じ
      
      if (isMobile) {
        // スマホ表示時は左寄りに固定
        link.style.setProperty('--x', '24px');
        link.style.setProperty('--y', `${rect.height / 2}px`);
      } else {
        // PC表示時は中央に配置
        link.style.setProperty('--x', `${rect.width / 2}px`);
        link.style.setProperty('--y', `${rect.height / 2}px`);
      }
    } else {
      link.removeAttribute('data-active');
    }
  });
}

// スムーススクロール
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        // ヘッダーの高さ（64px）を考慮
        const headerHeight = 64;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // モバイルメニューを閉じる
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });

  // スクロールイベントリスナーを追加
  window.addEventListener('scroll', updateActiveNavigation, { passive: true });
  // 初期状態を設定
  updateActiveNavigation();
}

// 全ての機能を初期化
function initHeader() {
  initLiquidEffect();
  initMobileMenu();
  initSmoothScroll();
}

// DOMContentLoadedとastro:page-loadの両方で初期化を実行
document.addEventListener('DOMContentLoaded', initHeader);
document.addEventListener('astro:page-load', initHeader);