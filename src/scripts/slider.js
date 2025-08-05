// カスタムスライドショーの実装
class CustomSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.dots = [];
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; // 5秒間隔
    this.touchStartX = 0;
    this.touchMoveX = 0;
    
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

      // タッチ操作（スワイプ）
      this.slider.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
        this.stopAutoplay();
      });

      this.slider.addEventListener('touchmove', (e) => {
        this.touchMoveX = e.touches[0].clientX;
      });

      this.slider.addEventListener('touchend', () => {
        const swipeDistance = this.touchStartX - this.touchMoveX;
        
        // 50px以上のスワイプで反応
        if (Math.abs(swipeDistance) > 50) {
          if (swipeDistance > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
        }
        
        this.startAutoplay();
      });
    }
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