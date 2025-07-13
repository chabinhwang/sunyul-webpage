document.addEventListener('DOMContentLoaded', () => {

    // 슬라이더 설정
    const sliders = document.querySelectorAll('.gallery-slider');
    const slideIndices = {};

    sliders.forEach(slider => {
        const sliderId = slider.id;
        if (!sliderId) return; // ID가 없는 슬라이더는 건너뜁니다.

        slideIndices[sliderId] = 0;
        
        // 터치 이벤트 리스너 추가
        let touchStartX = 0;
        slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) { // 왼쪽으로 스와이프
                moveSlide(1, sliderId);
            } else if (touchEndX - touchStartX > 50) { // 오른쪽으로 스와이프
                moveSlide(-1, sliderId);
            }
        });
    });

    window.moveSlide = (n, sliderId) => {
        const slider = document.getElementById(sliderId);
        if (!slider) return;
        const slides = slider.querySelectorAll('.slide');
        const totalSlides = slides.length;
        
        let newIndex = slideIndices[sliderId] + n;
        
        if (newIndex >= totalSlides) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = totalSlides - 1;
        }
        
        slideIndices[sliderId] = newIndex;
        updateSlider(sliderId);
    };

    function updateSlider(sliderId) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;
        slider.style.transform = `translateX(-${slideIndices[sliderId] * 100}%)`;
    }

    // 스크롤 진행 표시기
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('scroll-progress-bar').style.width = scrolled + '%';
    }, { passive: true });

    // 스크롤에 따른 애니메이션
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // 첫 번째 섹션이 즉시 보이도록 수정
    const firstSection = document.querySelector('main section');
    if (firstSection) {
        setTimeout(() => {
            firstSection.classList.add('visible');
        }, 100);
    }

    // 모달 이미지 뷰어
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModalBtn = document.querySelector('.close-modal');

    document.querySelectorAll('.zoomable').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'flex';
            modalImg.src = this.dataset.src || this.src;
            const caption = this.parentElement.querySelector('.slide-caption');
            modalCaption.textContent = caption ? caption.textContent : '';
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 부드러운 스크롤
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 이미지 지연 로딩
    const lazyImages = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, imgObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imgObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => lazyImageObserver.observe(img));
    }
});
