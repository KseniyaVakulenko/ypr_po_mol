/**
 * responsive.js - Управление адаптивным поведением
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация адаптивного меню
    initResponsiveMenu();
    
    // Обработка изменения размера окна
    initResizeHandler();
    
    // Адаптивные изображения
    initResponsiveImages();
    
    // Обработка touch-событий
    initTouchSupport();
    
    // Проверка поддержки функций
    checkFeatureSupport();
});

/**
 * Адаптивное меню
 */
function initResponsiveMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    
    // Открытие/закрытие бокового меню
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            sidebar.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрытие меню по кнопке
        if (sidebarClose) {
            sidebarClose.addEventListener('click', function() {
                sidebar.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        }
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('active')) {
                const isClickInsideSidebar = sidebar.contains(event.target);
                const isClickOnMenuToggle = menuToggle.contains(event.target);
                
                if (!isClickInsideSidebar && !isClickOnMenuToggle) {
                    sidebar.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Закрытие меню по Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Модальное окно входа
    function openLoginModal() {
        if (loginModal) {
            loginModal.classList.add('active');
            loginModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Фокус на первом элементе модального окна
            const firstFocusable = loginModal.querySelector('button, input, [tabindex]');
            if (firstFocusable) firstFocusable.focus();
        }
    }
    
    function closeLoginModalFunc() {
        if (loginModal) {
            loginModal.classList.remove('active');
            loginModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }
    
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', openLoginModal);
    }
    
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }
    
    if (closeLoginModal) {
        closeLoginModal.addEventListener('click', closeLoginModalFunc);
    }
    
    if (loginModal) {
        // Закрытие модального окна по клику на overlay
        loginModal.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                closeLoginModalFunc();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && loginModal.classList.contains('active')) {
                closeLoginModalFunc();
            }
        });
    }
}

/**
 * Обработчик изменения размера окна
 */
function initResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            updateLayoutForScreenSize();
        }, 250); // Дебаунс 250ms
    });
    
    // Первоначальная проверка
    updateLayoutForScreenSize();
}

function updateLayoutForScreenSize() {
    const width = window.innerWidth;
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (width >= 1025) {
        // Десктоп: показываем сайдбар
        if (sidebar) {
            sidebar.classList.remove('active');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }
    } else {
        // Мобильные/планшеты: скрываем сайдбар если он открыт
        if (sidebar && sidebar.classList.contains('active')) {
            // Оставляем как есть - пользователь мог открыть меню
        }
    }
    
    // Обновляем высоту для мобильных устройств
    setViewportHeight();
}

/**
 * Установка высоты viewport для мобильных устройств
 */
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Адаптивные изображения
 */
function initResponsiveImages() {
    // Ленивая загрузка изображений
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback для старых браузеров
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * Поддержка touch-событий
 */
function initTouchSupport() {
    // Улучшение работы на touch-устройствах
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        document.documentElement.classList.add('touch-device');
        
        // Улучшение скролла на iOS
        document.addEventListener('touchmove', function(event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        }, { passive: false });
    } else {
        document.documentElement.classList.add('no-touch-device');
    }
}

/**
 * Проверка поддержки функций
 */
function checkFeatureSupport() {
    // Проверка поддержки CSS Grid
    if (!CSS.supports('display', 'grid')) {
        document.documentElement.classList.add('no-css-grid');
        console.warn('CSS Grid не поддерживается, используем fallback');
    }
    
    // Проверка поддержки CSS Variables
    if (!CSS.supports('color', 'var(--primary)')) {
        document.documentElement.classList.add('no-css-variables');
        console.warn('CSS Variables не поддерживаются');
    }
    
    // Проверка поддержки Intersection Observer
    if (!('IntersectionObserver' in window)) {
        console.warn('Intersection Observer не поддерживается, ленивая загрузка может работать некорректно');
    }
}

/**
 * Сохранение состояния для PWA
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker зарегистрирован с областью: ', registration.scope);
        }, function(err) {
            console.log('Ошибка регистрации ServiceWorker: ', err);
        });
    });
}

/**
 * Офлайн-поддержка
 */
window.addEventListener('online', function() {
    showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Отсутствует подключение к интернету', 'warning');
});

/**
 * Улучшенная навигация с клавиатуры
 */
document.addEventListener('keydown', function(event) {
    // Навигация по секциям с Tab
    if (event.key === 'Tab') {
        document.documentElement.classList.add('keyboard-navigation');
    }
});

document.addEventListener('click', function() {
    document.documentElement.classList.remove('keyboard-navigation');
});

/**
 * Вспомогательная функция показа уведомлений
 */
function showNotification(message, type = 'info') {
    // Реализация уведомлений
    console.log(`${type}: ${message}`);
}