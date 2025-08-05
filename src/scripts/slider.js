// カスタムスライドショーの実装
class CustomSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.dots = [];
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; // 5秒間隔
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50; // スワイプを検知する最小距離（px）
    this.maxSwipeTime = 300; // スワイプを検知する最大時間（ms）
    this.touchStartTime = 0;
    this.isSwiping = false;
    
    this.init();
  }

  init() {
    // DOM要素を取得
    this.slider = document.querySelector('.custom-slider');
    if (!this.slider) return;

    this.slides = document.querySelectorAll('.slide');
    this.dots = document.querySelectorAll('.pagination-dot');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');

    if (this.slides.length === 0) return;

    // イベントリスナーを設定
    this.setupEventListeners();
    
    // 自動再生を開始
    this.startAutoplay();

    console.log('Custom slider initialized with', this.slides.length, 'slides');
  }

  setupEventListeners() {
    // ナビゲーションボタン
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // ページネーションドット
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // キーボード操作
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // マウスホバーで自動再生を一時停止
    if (this.slider) {
      this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
      this.slider.addEventListener('mouseleave', () => this.startAutoplay());
    }

    // タッチ操作（スワイプ）
    this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.slider.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    this.slider.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchStartTime = Date.now();
    this.isSwiping = true;
    this.stopAutoplay(); // スワイプ中は自動再生を停止
  }

  handleTouchMove(e) {
    if (!this.isSwiping) return;

    this.touchEndX = e.touches[0].clientX;
    this.touchEndY = e.touches[0].clientY;

    // 縦方向のスワイプを検知したらスライド操作をキャンセル
    const deltaY = Math.abs(this.touchEndY - this.touchStartY);
    const deltaX = Math.abs(this.touchEndX - this.touchStartX);
    if (deltaY > deltaX) {
      this.isSwiping = false;
      return;
    }

    // スワイプ中のスライドのトランジション
    const diff = this.touchEndX - this.touchStartX;
    const progress = Math.min(Math.abs(diff) / this.slider.offsetWidth, 1);
    
    // スライドの移動をアニメーション
    this.slides.forEach(slide => {
      slide.style.transition = 'none';
    });
  }

  handleTouchEnd(e) {
    if (!this.isSwiping) {
      this.startAutoplay();
      return;
    }

    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.touchStartTime;
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = Math.abs(this.touchEndY - this.touchStartY);
    
    // スワイプの条件をチェック
    if (
      Math.abs(deltaX) > this.minSwipeDistance && // 最小距離
      touchDuration < this.maxSwipeTime && // 最大時間
      Math.abs(deltaX) > deltaY // 横方向の移動が縦方向より大きい
    ) {
      if (deltaX > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }

    // スライドのトランジションを元に戻す
    this.slides.forEach(slide => {
      slide.style.transition = '';
    });

    this.isSwiping = false;
    this.startAutoplay(); // スワイプ終了後に自動再生を再開
  }

  goToSlide(index) {
    // 現在のスライドを非アクティブに
    this.slides[this.currentSlide].classList.remove('active');
    this.dots[this.currentSlide].classList.remove('active');

    // 新しいスライドをアクティブに
    this.currentSlide = index;
    this.slides[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide].classList.add('active');

    // 自動再生をリセット
    this.resetAutoplay();
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.startAutoplay();
  }
}

// DOM読み込み完了後にスライダーを初期化
function initCustomSlider() {
  const sliderElement = document.querySelector('.custom-slider');
  if (!sliderElement) {
    setTimeout(initCustomSlider, 100);
    return;
  }
  
  new CustomSlider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSlider);
} else {
  initCustomSlider();
}