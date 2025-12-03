// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления ника
    const nickname = document.getElementById('animated-nickname');
    setTimeout(() => {
        nickname.style.animation = 'fadeInUp 1.5s forwards';
    }, 500);
    
    // Предзагрузка аватарок и логотипа для лучшего UX
    function preloadImages() {
        const imageUrls = [
            'https://i.ibb.co/wrpVbnR5/avatar-voronov.jpg',
            'https://i.ibb.co/q3qmz85f/avatar-g4lub.jpg',
            'https://i.ibb.co/svfhyvFh/avatar-ceczu.jpg',
            'https://i.ibb.co/605nGKKs/avatar-xoyds.jpg',
            'https://i.ibb.co/ht6V2fZ/epysium-logo.jpg'
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Вызываем предзагрузку
    preloadImages();
    
    // Обработка ошибок загрузки изображений
    function handleImageErrors() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('error', function() {
                console.error('Не удалось загрузить изображение:', this.src);
                
                // Для аватарок друзей показываем инициалы
                if (this.closest('.friend-avatar')) {
                    const friendCard = this.closest('.friend-card');
                    const friendName = friendCard.querySelector('.friend-name').textContent;
                    const initials = getInitials(friendName);
                    const avatarContainer = this.closest('.friend-avatar');
                    
                    // Скрываем сломанное изображение
                    this.style.display = 'none';
                    
                    // Показываем инициалы
                    if (!avatarContainer.querySelector('.fallback-initials')) {
                        const initialsSpan = document.createElement('span');
                        initialsSpan.className = 'fallback-initials';
                        initialsSpan.textContent = initials;
                        initialsSpan.style.position = 'absolute';
                        initialsSpan.style.top = '50%';
                        initialsSpan.style.left = '50%';
                        initialsSpan.style.transform = 'translate(-50%, -50%)';
                        initialsSpan.style.fontSize = '2rem';
                        initialsSpan.style.fontWeight = '700';
                        initialsSpan.style.color = 'white';
                        initialsSpan.style.zIndex = '2';
                        avatarContainer.appendChild(initialsSpan);
                    }
                }
                
                // Для логотипа проекта показываем иконку
                if (this.id === 'project-img') {
                    const placeholder = this.closest('.project-placeholder');
                    this.style.display = 'none';
                    
                    if (!placeholder.querySelector('.fallback-icon')) {
                        const icon = document.createElement('i');
                        icon.className = 'fas fa-project-diagram fallback-icon';
                        icon.style.fontSize = '5rem';
                        icon.style.color = '#3a86ff';
                        icon.style.marginBottom = '20px';
                        placeholder.appendChild(icon);
                        
                        const text = document.createElement('p');
                        text.textContent = 'Epysium Project';
                        text.style.color = '#3a86ff';
                        text.style.fontSize = '1.2rem';
                        placeholder.appendChild(text);
                    }
                }
            });
        });
    }
    
    // Функция для получения инициалов из имени
    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    
    // Вызываем обработку ошибок
    setTimeout(handleImageErrors, 1000);
    
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
