// Основной скрипт сайта
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация темы
    initTheme();
    
    // Инициализация бокового меню
    initSidebar();
    
    // Инициализация поиска
    initSearch();
    
    // Инициализация уведомлений
    initNotifications();
    
    // Инициализация модальных окон
    initModals();
    
    // Инициализация cookie-уведомления
    initCookieNotice();
    
    // Инициализация календаря
    initCalendarWidget();
    
    // Инициализация клубов
    initClubs();
    
    // Инициализация таймлайна событий
    initTimeline();
    
    // Инициализация интерактивных элементов
    initInteractiveElements();
    
    // Загрузка данных
    loadData();
});

// Инициализация темы
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        updateThemeIcon('sun');
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        updateThemeIcon('moon');
    }
    
    // Обработчик переключения темы
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = body.classList.contains('dark-theme');
            
            if (isDark) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
                updateThemeIcon('moon');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon('sun');
            }
            
            // Добавляем анимацию перехода
            body.classList.add('theme-transition');
            setTimeout(() => {
                body.classList.remove('theme-transition');
            }, 300);
        });
    }
}

function updateThemeIcon(icon) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const iconElement = themeToggle.querySelector('i');
    const textElement = themeToggle.querySelector('span');
    
    if (icon === 'sun') {
        iconElement.className = 'fas fa-sun';
        if (textElement) textElement.textContent = 'Светлая тема';
    } else {
        iconElement.className = 'fas fa-moon';
        if (textElement) textElement.textContent = 'Темная тема';
    }
}

// Инициализация бокового меню
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const mainContent = document.querySelector('.main-content');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Меняем иконку
            const icon = menuToggle.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
            
            // Блокируем скролл основного контента
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('active');
            if (menuToggle) {
                menuToggle.querySelector('i').className = 'fas fa-bars';
                menuToggle.classList.remove('active');
            }
            document.body.style.overflow = '';
        });
    }
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (sidebar && sidebar.classList.contains('active')) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnMenuToggle = menuToggle && menuToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnMenuToggle) {
                sidebar.classList.remove('active');
                if (menuToggle) {
                    menuToggle.querySelector('i').className = 'fas fa-bars';
                    menuToggle.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        }
    });
    
    // Обработка ссылок в мобильном меню
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1400) {
                sidebar.classList.remove('active');
                if (menuToggle) {
                    menuToggle.querySelector('i').className = 'fas fa-bars';
                    menuToggle.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    });
}

// Инициализация поиска
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchClear = document.querySelector('.search-clear');
    
    if (searchInput) {
        // Очистка поля поиска
        searchInput.addEventListener('input', function() {
            if (searchClear) {
                searchClear.style.opacity = this.value ? '1' : '0';
            }
        });
        
        // Поиск при нажатии Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
                this.blur();
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
                this.style.opacity = '0';
            }
        });
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Показываем индикатор загрузки
    showLoader();
    
    // Симуляция поиска
    setTimeout(() => {
        hideLoader();
        showNotification(`Поиск: "${query}" - найдено 15 результатов`, 'info');
        
        // В реальном приложении здесь будет редирект или фильтрация
    }, 500);
}

// Инициализация уведомлений
function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const notificationList = document.querySelector('.notification-list');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });
        
        // Закрытие при клике вне
        document.addEventListener('click', function(event) {
            if (!notificationBtn.contains(event.target) && !notificationDropdown.contains(event.target)) {
                notificationDropdown.classList.remove('show');
            }
        });
    }
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            const notifications = document.querySelectorAll('.notification-item');
            const countElement = document.querySelector('.notification-count');
            
            notifications.forEach(item => {
                item.classList.add('read');
            });
            
            if (countElement) {
                countElement.textContent = '0';
                countElement.style.display = 'none';
            }
            
            showNotification('Все уведомления отмечены как прочитанные', 'success');
        });
    }
    
    // Загрузка уведомлений
    loadNotifications();
}

function loadNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;
    
    const notifications = [
        {
            id: 1,
            title: 'Новое мероприятие',
            message: 'Завтра состоится собрание студенческого совета',
            time: '10 мин назад',
            icon: 'calendar-alt',
            color: 'blue',
            unread: true
        },
        {
            id: 2,
            title: 'Обновление расписания',
            message: 'Изменено время занятий по веб-разработке',
            time: '1 час назад',
            icon: 'clock',
            color: 'green',
            unread: true
        },
        {
            id: 3,
            title: 'Приглашение в клуб',
            message: 'Вас приглашают вступить в IT Community',
            time: '2 часа назад',
            icon: 'users',
            color: 'purple',
            unread: true
        },
        {
            id: 4,
            title: 'Дедлайн',
            message: 'Осталось 3 дня до сдачи проекта',
            time: '5 часов назад',
            icon: 'exclamation-triangle',
            color: 'orange',
            unread: false
        },
        {
            id: 5,
            title: 'Новое сообщение',
            message: 'У вас новое сообщение в общем чате',
            time: '1 день назад',
            icon: 'comment',
            color: 'blue',
            unread: false
        }
    ];
    
    notificationList.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
            <div class="notification-icon bg-${notification.color}">
                <i class="fas fa-${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <h5>${notification.title}</h5>
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
            ${notification.unread ? '<div class="notification-dot"></div>' : ''}
        </div>
    `).join('');
    
    // Обработка кликов по уведомлениям
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            markAsRead(id);
            this.classList.remove('unread');
            this.querySelector('.notification-dot')?.remove();
            
            // Обновляем счетчик
            updateNotificationCount();
        });
    });
    
    // Обновляем счетчик
    updateNotificationCount();
}

function markAsRead(id) {
    // В реальном приложении здесь будет запрос к API
    console.log('Уведомление отмечено как прочитанное:', id);
}

function updateNotificationCount() {
    const countElement = document.querySelector('.notification-count');
    if (!countElement) return;
    
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    countElement.textContent = unreadCount;
    countElement.style.display = unreadCount > 0 ? 'flex' : 'none';
}

// Инициализация модальных окон
function initModals() {
    // Обработчик для всех кнопок, открывающих модальные окна
    document.addEventListener('click', function(e) {
        const modalTrigger = e.target.closest('[data-modal]');
        if (modalTrigger) {
            const modalId = modalTrigger.getAttribute('data-modal');
            openModal(modalId);
        }
        
        // Закрытие модальных окон
        if (e.target.classList.contains('modal-overlay') || 
            e.target.classList.contains('modal-close') ||
            e.target.classList.contains('btn-close-modal')) {
            closeModal();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const activeModal = document.querySelector('.modal.active');
    const overlay = document.getElementById('modalOverlay');
    
    if (activeModal && overlay) {
        activeModal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Инициализация cookie-уведомления
function initCookieNotice() {
    const cookieNotice = document.getElementById('cookieNotice');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    
    // Проверяем, было ли уведомление уже принято
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    
    if (!cookiesAccepted && cookieNotice) {
        setTimeout(() => {
            cookieNotice.style.display = 'flex';
            setTimeout(() => {
                cookieNotice.style.opacity = '1';
                cookieNotice.style.transform = 'translateY(0)';
            }, 100);
        }, 1000);
    }
    
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            
            if (cookieNotice) {
                cookieNotice.style.opacity = '0';
                cookieNotice.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    cookieNotice.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Инициализация календаря
function initCalendarWidget() {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    
    // Получаем первый день месяца
    const firstDay = new Date(currentYear, currentMonth, 1);
    // Получаем последний день месяца
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    // Получаем день недели первого дня (0 - воскресенье, 1 - понедельник и т.д.)
    const firstDayOfWeek = firstDay.getDay();
    // Количество дней в месяце
    const daysInMonth = lastDay.getDate();
    
    // Массив с названиями дней недели
    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    // Создаем заголовки дней недели
    let calendarHTML = '';
    daysOfWeek.forEach(day => {
        calendarHTML += `<div class="calendar-day calendar-header-day">${day}</div>`;
    });
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 1; i < firstDayOfWeek; i++) {
        calendarHTML += `<div class="calendar-day calendar-empty"></div>`;
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDay;
        const hasEvent = Math.random() > 0.7; // Случайно определяем, есть ли событие
        
        let dayClass = 'calendar-day';
        if (isToday) dayClass += ' current';
        if (hasEvent) dayClass += ' event';
        
        calendarHTML += `<div class="${dayClass}" data-day="${day}">${day}</div>`;
    }
    
    calendarGrid.innerHTML = calendarHTML;
    
    // Обработка кликов по дням
    const calendarDays = calendarGrid.querySelectorAll('.calendar-day:not(.calendar-header-day):not(.calendar-empty)');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            const selectedDay = this.getAttribute('data-day');
            showDayEvents(selectedDay, currentMonth, currentYear);
        });
    });
}

function showDayEvents(day, month, year) {
    const events = [
        'Собрание студсовета в 14:00',
        'Мастер-класс по ораторскому искусству в 16:00',
        'Турнир по настольному теннису в 19:00'
    ];
    
    const modalContent = `
        <div class="modal-header">
            <h2>События на ${day}.${month + 1}.${year}</h2>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <div class="events-list">
                ${events.map(event => `
                    <div class="event-item">
                        <i class="fas fa-calendar-check"></i>
                        <div class="event-info">
                            <h4>${event}</h4>
                            <p>Актовый зал</p>
                        </div>
                        <button class="btn btn-primary btn-sm">Записаться</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'dayEventsModal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    openModal('dayEventsModal');
}

// Инициализация клубов
function initClubs() {
    const joinButtons = document.querySelectorAll('.club-card .btn-primary');
    
    joinButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const clubCard = this.closest('.club-card');
            const clubName = clubCard.querySelector('h3').textContent;
            
            showNotification(`Заявка на вступление в "${clubName}" отправлена!`, 'success');
            
            // Меняем состояние кнопки
            this.textContent = 'Заявка отправлена';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-check"></i> Заявка отправлена';
            }, 500);
        });
    });
    
    // Действия клубов (три точки)
    const clubActions = document.querySelectorAll('.club-action');
    clubActions.forEach(action => {
        action.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const clubCard = this.closest('.club-card');
            const clubName = clubCard.querySelector('h3').textContent;
            
            // Показываем контекстное меню
            showContextMenu(this, [
                {
                    text: 'Подробнее о клубе',
                    icon: 'info-circle',
                    action: () => {
                        showNotification(`Информация о клубе "${clubName}"`, 'info');
                    }
                },
                {
                    text: 'Поделиться',
                    icon: 'share-alt',
                    action: () => {
                        showNotification(`Ссылка на клуб "${clubName}" скопирована`, 'success');
                    }
                },
                {
                    text: 'Сообщить о проблеме',
                    icon: 'flag',
                    action: () => {
                        showModal(
                            'Сообщить о проблеме',
                            `<p>Опишите проблему, связанную с клубом "${clubName}"</p>
                             <textarea class="form-control" rows="4" placeholder="Опишите проблему..."></textarea>`,
                            [
                                {
                                    text: 'Отмена',
                                    class: 'btn-outline',
                                    action: 'close'
                                },
                                {
                                    text: 'Отправить',
                                    class: 'btn-primary',
                                    action: () => {
                                        showNotification('Сообщение отправлено администраторам', 'success');
                                    }
                                }
                            ]
                        );
                    }
                }
            ]);
        });
    });
}

// Инициализация таймлайна событий
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            const time = this.querySelector('.timeline-time').textContent;
            
            showModal(
                title,
                `<div class="event-detail">
                    <div class="event-time">
                        <i class="fas fa-clock"></i>
                        <span>${time}</span>
                    </div>
                    <p>${description}</p>
                    <div class="event-actions">
                        <button class="btn btn-primary">Записаться</button>
                        <button class="btn btn-outline">Добавить в календарь</button>
                    </div>
                </div>`
            );
        });
    });
}

// Инициализация интерактивных элементов
function initInteractiveElements() {
    // Quick actions
    const quickActions = document.querySelectorAll('.action-btn-full');
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const actionText = this.querySelector('span').textContent;
            showNotification(`Действие: ${actionText}`, 'info');
        });
    });
    
    // Quick access cards
    const quickCards = document.querySelectorAll('.quick-card');
    quickCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.quick-badge')) {
                const title = this.querySelector('h3').textContent;
                showNotification(`Переход: ${title}`, 'info');
            }
        });
    });
    
    // Stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const value = this.querySelector('h3').textContent;
            const label = this.querySelector('p').textContent;
            showNotification(`${label}: ${value}`, 'info');
        });
    });
}

// Загрузка данных
function loadData() {
    // Симуляция загрузки данных
    setTimeout(() => {
        // Обновляем счетчики
        updateCounters();
        
        // Анимация появления элементов
        animateElements();
    }, 500);
}

function updateCounters() {
    // В реальном приложении здесь будут запросы к API
    const counters = {
        events: 8,
        clubs: 3,
        tasks: 2,
        messages: 5
    };
    
    // Обновляем значения в интерфейсе
    Object.keys(counters).forEach(key => {
        const elements = document.querySelectorAll(`[data-counter="${key}"]`);
        elements.forEach(element => {
            element.textContent = counters[key];
        });
    });
}

function animateElements() {
    // Анимация появления карточек
    const cards = document.querySelectorAll('.quick-card, .club-card, .stat-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fadeInUp');
    });
}

// Вспомогательные функции
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification-alert alert-${type}`;
    notification.innerHTML = `
        <div class="alert-content">
            <div class="alert-icon">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
            </div>
            <div class="alert-message">${message}</div>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Закрытие по клику
    const closeBtn = notification.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutLeft 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Автоматическое закрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutLeft 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'loader-overlay';
    loader.innerHTML = '<div class="loader loader-lg"></div>';
    document.body.appendChild(loader);
}

function hideLoader() {
    const loader = document.querySelector('.loader-overlay');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 300);
    }
}

function showContextMenu(element, items) {
    // Удаляем существующее меню
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Создаем меню
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = items.map(item => `
        <button class="context-menu-item" data-action="${item.text}">
            <i class="fas fa-${item.icon}"></i>
            <span>${item.text}</span>
        </button>
    `).join('');
    
    // Позиционируем меню
    const rect = element.getBoundingClientRect();
    menu.style.cssText = `
        position: fixed;
        top: ${rect.bottom + 5}px;
        left: ${rect.left}px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        min-width: 200px;
    `;
    
    document.body.appendChild(menu);
    
    // Обработчики для элементов меню
    const menuItems = menu.querySelectorAll('.context-menu-item');
    menuItems.forEach((menuItem, index) => {
        menuItem.addEventListener('click', () => {
            items[index].action();
            menu.remove();
        });
    });
    
    // Закрытие при клике вне меню
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target !== element) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Глобальные функции для использования в других скриптах
window.openModal = openModal;
window.closeModal = closeModal;
window.showNotification = showNotification;
window.showLoader = showLoader;
window.hideLoader = hideLoader;

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Ошибка:', e.error);
    showNotification('Произошла ошибка при загрузке страницы', 'error');
});

// Обработка offline/online
window.addEventListener('offline', function() {
    showNotification('Потеряно соединение с интернетом', 'warning');
});

window.addEventListener('online', function() {
    showNotification('Соединение восстановлено', 'success');
});

// Сохранение позиции скролла
window.addEventListener('beforeunload', function() {
    localStorage.setItem('scrollPosition', window.scrollY);
});

// Восстановление позиции скролла
window.addEventListener('load', function() {
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        localStorage.removeItem('scrollPosition');
    }
});