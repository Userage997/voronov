// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления ника
    const nickname = document.getElementById('animated-nickname');
    setTimeout(() => {
        nickname.style.animation = 'fadeInUp 1.5s forwards';
    }, 500);
    
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
        
        // Адаптация меню при изменении размера окна
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                navMenu.style.display = '';
            } else {
                if (!navMenu.classList.contains('active')) {
                    navMenu.style.display = 'none';
                }
            }
        });
    }
    
    // Плавная прокрутка по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Обновление активного пункта меню
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Закрытие мобильного меню после клика
                if (window.innerWidth <= 768 && navMenu) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
    
    // Обновление активного пункта меню при прокрутке
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками работ и друзей
    document.querySelectorAll('.work-card, .friend-card, .stat-card').forEach(card => {
        observer.observe(card);
    });
    
    // Загрузка изображений (заглушки, которые будут заменены)
    function loadImage(imgElement, placeholderElement, imageUrl) {
        if (imageUrl) {
            const img = new Image();
            img.onload = function() {
                imgElement.src = imageUrl;
                placeholderElement.style.display = 'none';
                imgElement.style.display = 'block';
            };
            img.onerror = function() {
                console.error('Не удалось загрузить изображение:', imageUrl);
            };
            img.src = imageUrl;
        }
    }
    
    // Функции для обновления изображений (будут вызваны позже)
    window.updateAvatar = function(imageUrl) {
        const avatarPlaceholder = document.getElementById('avatar-placeholder');
        const img = avatarPlaceholder.querySelector('img') || document.createElement('img');
        img.id = 'avatar-img';
        img.style.display = 'none';
        
        if (!avatarPlaceholder.contains(img)) {
            avatarPlaceholder.appendChild(img);
        }
        
        loadImage(img, avatarPlaceholder, imageUrl);
    };
    
    window.updateProjectImage = function(imageUrl) {
        const projectPlaceholder = document.getElementById('project-placeholder');
        const img = projectPlaceholder.querySelector('img') || document.createElement('img');
        img.id = 'project-img';
        img.style.display = 'none';
        
        if (!projectPlaceholder.contains(img)) {
            projectPlaceholder.appendChild(img);
        }
        
        loadImage(img, projectPlaceholder, imageUrl);
    };
    
    // Анимация заполнения skill-bars при скролле
    const skillBars = document.querySelectorAll('.skill-level');
    const skillBarObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target;
                const width = skillLevel.style.width;
                skillLevel.style.width = '0';
                
                setTimeout(() => {
                    skillLevel.style.transition = 'width 2s ease-out';
                    skillLevel.style.width = width;
                }, 300);
                
                skillBarObserver.unobserve(skillLevel);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillBarObserver.observe(bar);
    });
    
    // Добавляем текущий год в футер
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
    }
    
    // Исправление для стрелочки на мобильных устройствах
    function adjustScrollIndicator() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const scrollIndicator = document.querySelector('.scroll-indicator-container');
        
        if (window.innerWidth <= 768) {
            // На мобильных добавляем отступ, чтобы стрелочка не наезжала на текст
            if (heroSubtitle && scrollIndicator) {
                const subtitleHeight = heroSubtitle.offsetHeight;
                scrollIndicator.style.bottom = Math.max(30, 20 + subtitleHeight / 2) + 'px';
            }
        } else {
            // На десктопе возвращаем обычное положение
            if (scrollIndicator) {
                scrollIndicator.style.bottom = '40px';
            }
        }
    }
    
    // Вызываем при загрузке и изменении размера окна
    adjustScrollIndicator();
    window.addEventListener('resize', adjustScrollIndicator);
    
    // Индикатор загрузки
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});
