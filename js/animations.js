// Анимации и динамические элементы
document.addEventListener('DOMContentLoaded', function() {
    // Обновление даты в реальном времени
    function updateDateTime() {
        const now = new Date();
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        
        const dayElement = document.getElementById('currentDay');
        const dateElement = document.getElementById('currentDate');
        
        if (dayElement) {
            dayElement.textContent = days[now.getDay()];
        }
        
        if (dateElement) {
            dateElement.textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        }
    }
    
    // Анимация при скролле
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Наблюдаем за элементами для анимации
        document.querySelectorAll('.section-card, .project-card-large').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Плавающие шарики
    function initFloatingShapes() {
        const container = document.querySelector('.header-shapes');
        if (!container) return;
        
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'shape';
            shape.style.width = `${Math.random() * 100 + 50}px`;
            shape.style.height = shape.style.width;
            shape.style.left = `${Math.random() * 100}%`;
            shape.style.top = `${Math.random() * 100}%`;
            shape.style.animationDuration = `${Math.random() * 20 + 20}s`;
            shape.style.animationDelay = `-${Math.random() * 20}s`;
            shape.style.opacity = Math.random() * 0.3 + 0.1;
            container.appendChild(shape);
        }
    }
    
    // Инициализация
    updateDateTime();
    setInterval(updateDateTime, 60000); // Обновлять каждую минуту
    
    initScrollAnimations();
    initFloatingShapes();
    
    // Обработка кнопки входа
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showNotification('Функция входа в разработке', 'info');
            // В будущем - открытие модального окна входа
        });
    }

    // Обновление креативной даты
function updateCreativeDateTime() {
    const now = new Date();
    
    // Массивы для перевода
    const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    
    // Получаем элементы
    const dayNumElement = document.getElementById('currentDayNum');
    const monthElement = document.getElementById('currentMonth');
    const weekdayElement = document.getElementById('currentWeekday');
    const yearElement = document.getElementById('currentYear');
    
    // Обновляем элементы если они существуют
    if (dayNumElement) {
        dayNumElement.textContent = now.getDate();
    }
    
    if (monthElement) {
        monthElement.textContent = months[now.getMonth()];
    }
    
    if (weekdayElement) {
        weekdayElement.textContent = weekdays[now.getDay()];
    }
    
    if (yearElement) {
        yearElement.textContent = now.getFullYear();
    }
    
    // Добавляем классы для выходных
    const creativeDate = document.querySelector('.creative-date');
    if (creativeDate) {
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const isSpecialDay = checkSpecialDay(now);
        
        creativeDate.classList.toggle('weekend', isWeekend);
        creativeDate.classList.toggle('special-day', isSpecialDay);
        
        // Меняем цвет круга для выходных
        if (isWeekend) {
            const dateCircle = creativeDate.querySelector('.date-circle');
            if (dateCircle) {
                dateCircle.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e53)';
            }
        }
    }
}

// Проверка особых дней (можно расширить)
function checkSpecialDay(date) {
    const specialDays = [
        '01-01', // Новый год
        '02-23', // День защитника Отечества
        '03-08', // Международный женский день
        '05-09', // День Победы
        '06-01', // День защиты детей
        '09-01', // День знаний
        '12-25', // Рождество
    ];
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${month}-${day}`;
    
    return specialDays.includes(dateStr);
}

// Добавляем интерактивность дате
function initDateInteractions() {
    const creativeDate = document.querySelector('.creative-date');
    if (!creativeDate) return;
    
    // Клик по дате показывает подробную информацию
    creativeDate.addEventListener('click', function() {
        this.classList.toggle('expanded');
        
        if (this.classList.contains('expanded')) {
            showDateDetails();
        }
    });
    
    // Касание на мобильных
    creativeDate.addEventListener('touchstart', function(e) {
        this.classList.add('touched');
    });
    
    creativeDate.addEventListener('touchend', function(e) {
        this.classList.remove('touched');
    });
}

// Показ подробностей даты
function showDateDetails() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const fullDate = now.toLocaleDateString('ru-RU', options);
    const time = now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    showNotification(`Сегодня: ${fullDate}. Время: ${time}`, 'info');
}

// Инициализация в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Обновление даты
    updateCreativeDateTime();
    setInterval(updateCreativeDateTime, 60000); // Каждую минуту
    
    // Интерактивность даты
    initDateInteractions();
    
    // Анимация появления даты при загрузке
    setTimeout(() => {
        const creativeDate = document.querySelector('.creative-date');
        if (creativeDate) {
            creativeDate.style.opacity = '0';
            creativeDate.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                creativeDate.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                creativeDate.style.opacity = '1';
                creativeDate.style.transform = 'translateY(0)';
            });
        }
    }, 300);
});

// Функция для переключения стилей даты (по необходимости)
function toggleDateStyle() {
    const creativeDate = document.querySelector('.creative-date');
    if (!creativeDate) return;
    
    const styles = ['default', 'minimal', 'horizontal'];
    const currentStyle = [...creativeDate.classList]
        .find(cls => styles.includes(cls)) || 'default';
    
    const nextStyle = styles[(styles.indexOf(currentStyle) + 1) % styles.length];
    
    // Удаляем все стили
    creativeDate.classList.remove(...styles);
    // Добавляем следующий стиль
    creativeDate.classList.add(nextStyle);
    
    // Сохраняем в localStorage
    localStorage.setItem('dateStyle', nextStyle);
    
    showNotification(`Стиль даты изменён на: ${nextStyle}`, 'info');
}

// Загрузка сохранённого стиля даты
function loadDateStyle() {
    const savedStyle = localStorage.getItem('dateStyle');
    const creativeDate = document.querySelector('.creative-date');
    
    if (savedStyle && creativeDate) {
        const styles = ['default', 'minimal', 'horizontal'];
        creativeDate.classList.remove(...styles);
        creativeDate.classList.add(savedStyle);
    }
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', loadDateStyle);
});

// Обновление креативной даты
function updateCreativeDateTime() {
    const now = new Date();
    
    // Массивы для перевода
    const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    
    // Получаем элементы
    const dayNumElement = document.getElementById('currentDayNum');
    const monthElement = document.getElementById('currentMonth');
    const weekdayElement = document.getElementById('currentWeekday');
    const yearElement = document.getElementById('currentYear');
    
    // Обновляем элементы если они существуют
    if (dayNumElement) {
        dayNumElement.textContent = now.getDate();
    }
    
    if (monthElement) {
        monthElement.textContent = months[now.getMonth()];
    }
    
    if (weekdayElement) {
        weekdayElement.textContent = weekdays[now.getDay()];
    }
    
    if (yearElement) {
        yearElement.textContent = now.getFullYear();
    }
    
    // Добавляем классы для выходных
    const creativeDate = document.querySelector('.creative-date');
    if (creativeDate) {
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        const isSpecialDay = checkSpecialDay(now);
        
        creativeDate.classList.toggle('weekend', isWeekend);
        creativeDate.classList.toggle('special-day', isSpecialDay);
        
        // Меняем цвет круга для выходных
        if (isWeekend) {
            const dateCircle = creativeDate.querySelector('.date-circle');
            if (dateCircle) {
                dateCircle.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e53)';
            }
        }
    }
}

// Проверка особых дней (можно расширить)
function checkSpecialDay(date) {
    const specialDays = [
        '01-01', // Новый год
        '02-23', // День защитника Отечества
        '03-08', // Международный женский день
        '05-09', // День Победы
        '06-01', // День защиты детей
        '09-01', // День знаний
        '12-25', // Рождество
    ];
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${month}-${day}`;
    
    return specialDays.includes(dateStr);
}

// Добавляем интерактивность дате
function initDateInteractions() {
    const creativeDate = document.querySelector('.creative-date');
    if (!creativeDate) return;
    
    // Клик по дате показывает подробную информацию
    creativeDate.addEventListener('click', function() {
        this.classList.toggle('expanded');
        
        if (this.classList.contains('expanded')) {
            showDateDetails();
        }
    });
    
    // Касание на мобильных
    creativeDate.addEventListener('touchstart', function(e) {
        this.classList.add('touched');
    });
    
    creativeDate.addEventListener('touchend', function(e) {
        this.classList.remove('touched');
    });
}

// Показ подробностей даты
function showDateDetails() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const fullDate = now.toLocaleDateString('ru-RU', options);
    const time = now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    showNotification(`Сегодня: ${fullDate}. Время: ${time}`, 'info');
}

// Инициализация в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Обновление даты
    updateCreativeDateTime();
    setInterval(updateCreativeDateTime, 60000); // Каждую минуту
    
    // Интерактивность даты
    initDateInteractions();
    
    // Анимация появления даты при загрузке
    setTimeout(() => {
        const creativeDate = document.querySelector('.creative-date');
        if (creativeDate) {
            creativeDate.style.opacity = '0';
            creativeDate.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                creativeDate.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                creativeDate.style.opacity = '1';
                creativeDate.style.transform = 'translateY(0)';
            });
        }
    }, 300);
});

// Функция для переключения стилей даты (по необходимости)
function toggleDateStyle() {
    const creativeDate = document.querySelector('.creative-date');
    if (!creativeDate) return;
    
    const styles = ['default', 'minimal', 'horizontal'];
    const currentStyle = [...creativeDate.classList]
        .find(cls => styles.includes(cls)) || 'default';
    
    const nextStyle = styles[(styles.indexOf(currentStyle) + 1) % styles.length];
    
    // Удаляем все стили
    creativeDate.classList.remove(...styles);
    // Добавляем следующий стиль
    creativeDate.classList.add(nextStyle);
    
    // Сохраняем в localStorage
    localStorage.setItem('dateStyle', nextStyle);
    
    showNotification(`Стиль даты изменён на: ${nextStyle}`, 'info');
}

// Загрузка сохранённого стиля даты
function loadDateStyle() {
    const savedStyle = localStorage.getItem('dateStyle');
    const creativeDate = document.querySelector('.creative-date');
    
    if (savedStyle && creativeDate) {
        const styles = ['default', 'minimal', 'horizontal'];
        creativeDate.classList.remove(...styles);
        creativeDate.classList.add(savedStyle);
    }
}

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', loadDateStyle);