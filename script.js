// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentTheme = localStorage.getItem('theme') || 'light';

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initCurrentYear();
    initRandomFacts();
    initEventListeners();
    initAchievements();
    
    // Показываем первую секцию
    showSection('home');
});

// ===== ТЕМА =====
function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        icon.parentElement.innerHTML = '<i class="fas fa-sun"></i> Светлая';
    } else {
        icon.className = 'fas fa-moon';
        icon.parentElement.innerHTML = '<i class="fas fa-moon"></i> Темная';
    }
}

// ===== НАВИГАЦИЯ =====
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav a');

    // Мобильное меню
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Навигация по секциям
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Обновляем активные классы
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Показываем выбранную секцию
            showSection(targetId);
            
            // Закрываем мобильное меню
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });
}

function showSection(sectionId) {
    // Скрываем все секции
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем выбранную секцию
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Прокрутка к началу секции
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== СЛУЧАЙНЫЕ ФАКТЫ =====
const scienceFacts = [
    "Человеческое тело содержит достаточно углерода, чтобы заполнить 900 карандашей",
    "ДНК человека на 50% совпадает с ДНК банана",
    "Водород - самый распространенный элемент во Вселенной",
    "Золото можно сделать настолько тонким, что оно станет полупрозрачным",
    "Мозг человека на 60% состоит из жира",
    "Глаз человека может различать 10 миллионов различных цветов",
    "Кости человека в 4 раза прочнее бетона",
    "Сердце перекачивает около 7570 литров крови ежедневно",
    "Желудочный сок может растворить лезвие бритвы",
    "Человек производит около 1 литра слюны в день"
];

function initRandomFacts() {
    const factElement = document.getElementById('todayFact');
    if (factElement) {
        const randomFact = scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
        factElement.textContent = randomFact;
        
        // Меняем факт каждые 10 секунд
        setInterval(() => {
            const newFact = scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
            factElement.style.opacity = '0';
            setTimeout(() => {
                factElement.textContent = newFact;
                factElement.style.opacity = '1';
            }, 500);
        }, 10000);
    }
}

// ===== СЛУЧАЙНАЯ ИГРА =====
function initEventListeners() {
    // Кнопка случайной игры
    const randomGameBtn = document.getElementById('randomGameBtn');
    if (randomGameBtn) {
        randomGameBtn.addEventListener('click', () => {
            const games = ['molecule'];
            const randomGame = games[Math.floor(Math.random() * games.length)];
            
            if (randomGame === 'molecule') {
                window.location.href = 'games/molecule.html';
            }
        });
    }

    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// ===== ДОСТИЖЕНИЯ (базовая система) =====
function initAchievements() {
    loadAchievements();
    renderAchievements();
    
    // Разблокируем первое достижение при первом посещении
    setTimeout(() => {
        if (!localStorage.getItem('firstVisit')) {
            unlockAchievement('first_visit');
            localStorage.setItem('firstVisit', 'true');
        }
    }, 2000);
}

const achievements = [
    {
        id: 'first_visit',
        title: 'Первое посещение',
        description: 'Зашел на сайт впервые',
        icon: 'fas fa-door-open',
        unlocked: false,
        date: null
    },
    {
        id: 'first_game',
        title: 'Юный химик',
        description: 'Сыграл в первую игру',
        icon: 'fas fa-flask',
        unlocked: false,
        date: null
    },
    {
        id: 'blog_post',
        title: 'Начинающий блогер',
        description: 'Написал первый пост в блоге',
        icon: 'fas fa-pen',
        unlocked: false,
        date: null
    },
    {
        id: 'elements_5',
        title: 'Знаток элементов',
        description: 'Изучил 5 элементов в таблице',
        icon: 'fas fa-atom',
        unlocked: false,
        date: null
    }
];

function saveAchievements() {
    localStorage.setItem('bioChemAchievements', JSON.stringify(achievements));
}

function loadAchievements() {
    const saved = localStorage.getItem('bioChemAchievements');
    if (saved) {
        const savedAchievements = JSON.parse(saved);
        achievements.forEach((ach, index) => {
            const savedAch = savedAchievements.find(a => a.id === ach.id);
            if (savedAch) {
                achievements[index] = { ...ach, ...savedAch };
            }
        });
    }
}

function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.date = new Date().toLocaleDateString('ru-RU');
        saveAchievements();
        renderAchievements();
        showAchievementNotification(achievement);
        
        // Обновляем общий прогресс
        updateProgress();
    }
}

function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        card.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <h4>${achievement.title}</h4>
            <p>${achievement.description}</p>
            ${achievement.date ? `<div class="achievement-date">${achievement.date}</div>` : ''}
        `;
        
        container.appendChild(card);
    });
    
    updateProgress();
}

function updateProgress() {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const progress = (unlockedCount / totalCount) * 100;
    
    // Обновляем счетчики
    const achievedElement = document.getElementById('achievedCount');
    const totalElement = document.getElementById('totalCount');
    const progressValue = document.getElementById('progressValue');
    const progressCircle = document.getElementById('progressCircle');
    
    if (achievedElement) achievedElement.textContent = unlockedCount;
    if (totalElement) totalElement.textContent = totalCount;
    if (progressValue) progressValue.textContent = `${Math.round(progress)}%`;
    if (progressCircle) {
        progressCircle.style.background = `conic-gradient(var(--accent2) ${progress * 3.6}deg, #e0e0e0 0deg)`;
    }
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${achievement.icon}"></i>
            <div>
                <h4>Достижение получено!</h4>
                <p><strong>${achievement.title}</strong><br>
                ${achievement.description}</p>
            </div>
            <button class="close-notification">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-left: 5px solid var(--accent2);
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.5s ease;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .achievement-notification .notification-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .achievement-notification i {
            font-size: 2rem;
            color: var(--accent2);
        }
        .achievement-notification h4 {
            margin: 0 0 5px 0;
            color: var(--dark);
        }
        .achievement-notification p {
            margin: 0;
            font-size: 0.9rem;
            color: #666;
        }
        .close-notification {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #999;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        }
        .close-notification:hover {
            color: var(--accent2);
        }
    `;
    document.head.appendChild(style);
    
    // Закрытие уведомления
    notification.querySelector('.close-notification').onclick = () => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    };
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Экспорт функций для использования в других файлах
window.unlockAchievement = unlockAchievement;
window.showSection = showSection;
// ===== ИНТЕГРАЦИЯ С НАСТРОЙКАМИ =====

// Инициализация настроек при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки настроек
    setTimeout(() => {
        if (typeof getAppSettings === 'function') {
            const settings = getAppSettings();
            
            // Применяем настройки уведомлений
            if (settings.notifyAchievements && typeof unlockAchievement === 'function') {
                // Перехватываем разблокировку достижений для уведомлений
                const originalUnlockAchievement = window.unlockAchievement;
                window.unlockAchievement = function(...args) {
                    originalUnlockAchievement.apply(this, args);
                    
                    // Показываем уведомление если включено
                    if (settings.notifyAchievements) {
                        const achievementId = args[0];
                        const achievements = window.achievements || [];
                        const achievement = achievements.find(a => a.id === achievementId);
                        
                        if (achievement) {
                            showCustomNotification(`Новое достижение: ${achievement.title}!`, 'achievement');
                        }
                    }
                };
            }
        }
    }, 1000);
});

// Функция для кастомных уведомлений
function showCustomNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'achievement' ? 'trophy' : 
                             type === 'success' ? 'check-circle' : 
                             type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Стили для уведомления
    const style = document.createElement('style');
    style.textContent = `
        .custom-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            border-left: 5px solid var(--accent2);
            max-width: 350px;
        }
        
        .custom-notification.achievement {
            border-left-color: #ffd700;
            background: linear-gradient(135deg, #fff9c4, #fff);
        }
        
        .custom-notification.success {
            border-left-color: #4CAF50;
        }
        
        .custom-notification.error {
            border-left-color: #ff6b6b;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .notification-content i {
            font-size: 1.5rem;
        }
        
        .custom-notification.achievement i {
            color: #ffd700;
        }
        
        .custom-notification.success i {
            color: #4CAF50;
        }
        
        .custom-notification.error i {
            color: #ff6b6b;
        }
        
        .notification-content span {
            color: var(--dark);
            font-weight: 500;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Автоматическое закрытие
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 5000);
}

// Экспортируем функцию для использования в других файлах
window.showCustomNotification = showCustomNotification;