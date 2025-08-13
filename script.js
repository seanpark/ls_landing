// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 전역 변수
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const modal = document.getElementById('demoModal');
    const closeModal = document.querySelector('.close');
    const rfidTags = document.querySelectorAll('.rfid-tag');
    const workflowSteps = document.querySelectorAll('.step');
    const detailContents = document.querySelectorAll('.detail-content');

    // 초기화
    init();

    function init() {
        setupScrollEffects();
        setupNavigation();
        setupModal();
        setupRFIDAnimation();
        setupWorkflow();
        setupForms();
        setupSmoothScroll();
    }

    // 스크롤 효과 설정
    function setupScrollEffects() {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;

            // 헤더 배경 효과
            if (scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }

            // 스크롤 애니메이션
            const elements = document.querySelectorAll('.feature-card, .stat-card, .step');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        });

        // 초기 애니메이션 설정
        const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .step');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
        });
    }

    // 네비게이션 설정
    function setupNavigation() {
        // 모바일 메뉴 토글
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 메뉴 링크 클릭 시 모바일 메뉴 닫기
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // 네비게이션 활성 상태 업데이트
        window.addEventListener('scroll', updateActiveNavLink);
    }

    // 활성 네비게이션 링크 업데이트
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // 모달 설정
    function setupModal() {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    // RFID 태그 애니메이션 설정
    function setupRFIDAnimation() {
        let currentTag = 0;
        
        function animateRFIDTags() {
            rfidTags.forEach(tag => tag.classList.remove('active'));
            rfidTags[currentTag].classList.add('active');
            currentTag = (currentTag + 1) % rfidTags.length;
        }

        // 초기 애니메이션 시작
        if (rfidTags.length > 0) {
            setInterval(animateRFIDTags, 2000);
        }

        // 클릭 이벤트 추가
        rfidTags.forEach((tag, index) => {
            tag.addEventListener('click', function() {
                rfidTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                currentTag = index;
                
                // 클릭 효과
                tag.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    tag.style.transform = '';
                }, 200);
            });
        });
    }

    // 워크플로우 설정
    function setupWorkflow() {
        workflowSteps.forEach((step, index) => {
            step.addEventListener('click', function() {
                // 모든 스텝에서 active 클래스 제거
                workflowSteps.forEach(s => s.classList.remove('active'));
                detailContents.forEach(d => d.classList.remove('active'));

                // 클릭한 스텝에 active 클래스 추가
                step.classList.add('active');
                
                // 해당 상세 내용 표시
                const stepNumber = step.getAttribute('data-step');
                const targetDetail = document.querySelector(`[data-detail="${stepNumber}"]`);
                if (targetDetail) {
                    targetDetail.classList.add('active');
                }

                // 클릭 애니메이션
                const stepIcon = step.querySelector('.step-icon');
                stepIcon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    stepIcon.style.transform = '';
                }, 200);
            });
        });
    }

    // 폼 설정
    function setupForms() {
        // 연락처 폼
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
        }

        // 데모 신청 폼
        const demoForm = document.getElementById('demoForm');
        if (demoForm) {
            demoForm.addEventListener('submit', handleDemoForm);
        }
    }

    // 연락처 폼 처리
    function handleContactForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // 폼 검증
        if (!validateContactForm(data)) {
            return;
        }

        // 로딩 상태 표시
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> 전송 중...';
        submitBtn.disabled = true;

        // 시뮬레이션: 실제로는 서버로 데이터 전송
        setTimeout(() => {
            showMessage('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.', 'success');
            event.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // 데모 신청 폼 처리
    function handleDemoForm(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        // 폼 검증
        if (!validateDemoForm(data)) {
            return;
        }

        // 로딩 상태 표시
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> 신청 중...';
        submitBtn.disabled = true;

        // 시뮬레이션: 실제로는 서버로 데이터 전송
        setTimeout(() => {
            showMessage('데모 신청이 완료되었습니다. 곧 연락드려 일정을 조율하겠습니다.', 'success');
            event.target.reset();
            modal.style.display = 'none';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // 연락처 폼 검증
    function validateContactForm(data) {
        const requiredFields = ['company', 'name', 'phone', 'email'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                showMessage(`${getFieldLabel(field)}을(를) 입력해주세요.`, 'error');
                return false;
            }
        }

        // 이메일 검증
        if (!isValidEmail(data.email)) {
            showMessage('올바른 이메일 주소를 입력해주세요.', 'error');
            return false;
        }

        // 전화번호 검증
        if (!isValidPhone(data.phone)) {
            showMessage('올바른 전화번호를 입력해주세요.', 'error');
            return false;
        }

        return true;
    }

    // 데모 폼 검증
    function validateDemoForm(data) {
        const requiredFields = ['company', 'name', 'phone', 'email'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                showMessage(`${getFieldLabel(field)}을(를) 입력해주세요.`, 'error');
                return false;
            }
        }

        // 이메일 검증
        if (!isValidEmail(data.email)) {
            showMessage('올바른 이메일 주소를 입력해주세요.', 'error');
            return false;
        }

        // 전화번호 검증
        if (!isValidPhone(data.phone)) {
            showMessage('올바른 전화번호를 입력해주세요.', 'error');
            return false;
        }

        return true;
    }

    // 필드 라벨 반환
    function getFieldLabel(field) {
        const labels = {
            company: '회사명',
            name: '담당자명',
            phone: '연락처',
            email: '이메일'
        };
        return labels[field] || field;
    }

    // 이메일 검증
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 전화번호 검증
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9-+\s()]+$/;
        return phoneRegex.test(phone) && phone.replace(/[^0-9]/g, '').length >= 10;
    }

    // 메시지 표시
    function showMessage(text, type) {
        // 기존 메시지 제거
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 새 메시지 생성
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;

        // 폼 위에 메시지 삽입
        const activeForm = document.querySelector('form:target, #contactForm, #demoForm');
        if (activeForm) {
            activeForm.insertBefore(message, activeForm.firstChild);
        }

        // 3초 후 메시지 제거
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    // 부드러운 스크롤 설정
    function setupSmoothScroll() {
        // 내부 링크에 대한 부드러운 스크롤
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 전역 함수 정의 (HTML에서 호출)
    window.openDemo = function() {
        modal.style.display = 'block';
        
        // 모달 애니메이션
        const modalContent = document.querySelector('.modal-content');
        modalContent.style.animation = 'none';
        modalContent.offsetHeight; // 리플로우 강제
        modalContent.style.animation = 'modalSlideIn 0.3s ease';
    };

    window.openContact = function() {
        scrollToSection('contact');
    };

    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = header.offsetHeight;
            const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    // 성능 최적화: 스크롤 이벤트 스로틀링
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 스크롤 이벤트에 스로틀링 적용
    window.addEventListener('scroll', throttle(function() {
        updateActiveNavLink();
    }, 100));

    // 리사이즈 이벤트 처리
    window.addEventListener('resize', function() {
        // 모바일 메뉴가 열려있을 때 창 크기가 변경되면 메뉴 닫기
        if (window.innerWidth > 768) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // 키보드 접근성 향상
    document.addEventListener('keydown', function(e) {
        // Tab 키 네비게이션 개선
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });

    // 인터섹션 옵저버를 이용한 애니메이션 최적화
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 애니메이션 대상 요소들 관찰
        const animateElements = document.querySelectorAll('.feature-card, .stat-card, .comparison-item');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // 로딩 완료 후 페이드인 효과
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });

    // 개발 모드에서의 디버깅 정보
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('LaundrySync Landing Page - Development Mode');
        console.log('All interactions initialized successfully');
    }
});