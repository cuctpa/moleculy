// settings.js - управление настройками сайта
document.addEventListener('DOMContentLoaded', () => {
    initSettings();
    initHelp();
});

// ===== НАСТРОЙКИ =====
function initSettings() {
    loadSettings();
    setupSettingsEventListeners();
    updateSettingsUI();
}

// Загрузка настроек из localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('bioChemSettings')) || {
        // Основные настройки
        userName: 'Катя',
        userClass: '10',
        userBio: 'Учусь в 10 классе, интересуюсь химией и биологией, люблю проводить эксперименты!',
        
        // Учебные настройки
        showComplexFormulas: true,
        autoSaveBlog: true,
        showHints: true,
        
        // Внешний вид
        theme: 'light',
        fontSize: 'medium',
        animationSpeed: 'normal',
        
        // Настройки игр
        gameDifficulty: 'medium',
        soundEffects: true,
        vibration: true,
        levelTime: 90,
        
        // Уведомления
        notifyAchievements: true,
        notifyDailyFacts: false,
        notifyStudyReminders: false,
        reminderTime: '18:00'
    };
    
    // Применяем настройки
    applySettings(settings);
    
    // Сохраняем в глобальную переменную
    window.appSettings = settings;
    
    return settings;
}

// Применение настроек
function applySettings(settings) {
    // Применяем тему
    document.documentElement.setAttribute('data-theme', settings.theme);
    
    // Применяем размер шрифта
    document.documentElement.style.fontSize = getFontSizeValue(settings.fontSize);
    
    // Применяем скорость анимаций
    document.documentElement.style.setProperty('--transition', getAnimationSpeed(settings.animationSpeed));
    
    // Обновляем имя в интерфейсе
    const nameElements = document.querySelectorAll('.highlight');
    nameElements.forEach(el => {
        if (el.textContent.includes('Катя') || el.textContent.includes('Аня')) {
            el.textContent = settings.userName;
        }
    });
    
    // Обновляем статистику игр
    updateGameStats();
}

// Получение размера шрифта
function getFontSizeValue(size) {
    switch(size) {
        case 'small': return '14px';
        case 'medium': return '16px';
        case 'large': return '18px';
        default: return '16px';
    }
}

// Получение скорости анимаций
function getAnimationSpeed(speed) {
    switch(speed) {
        case 'none': return '0s';
        case 'slow': return '0.5s ease';
        case 'normal': return '0.3s ease';
        case 'fast': return '0.15s ease';
        default: return '0.3s ease';
    }
}

// Настройка обработчиков событий
function setupSettingsEventListeners() {
    // Кнопки открытия модальных окон
    const settingsLink = document.getElementById('settingsLink');
    const helpLink = document.getElementById('helpLink');
    
    if (settingsLink) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            openSettingsModal();
        });
    }
    
    if (helpLink) {
        helpLink.addEventListener('click', (e) => {
            e.preventDefault();
            openHelpModal();
        });
    }
    
    // Настройки в модальном окне
    setupSettingsModalEvents();
}

// Открытие модального окна настроек
function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        updateSettingsUI();
    }
}

// Настройка событий в модальном окне настроек
function setupSettingsModalEvents() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    
    // Закрытие модального окна
    const closeBtn = modal.querySelector('.close-modal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', closeSettingsModal);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettingsModal);
    
    // Сохранение настроек
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
    
    // Переключение вкладок
    const tabBtns = modal.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Выбор темы
    const themeOptions = modal.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
    
    // Размер шрифта
    const fontSizeBtns = modal.querySelectorAll('.font-size-btn');
    fontSizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fontSizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Ползунок времени
    const timeSlider = document.getElementById('levelTime');
    const timeValue = document.getElementById('timeValue');
    
    if (timeSlider && timeValue) {
        timeSlider.addEventListener('input', () => {
            timeValue.textContent = timeSlider.value;
        });
    }
    
    // Кнопка сброса статистики
    const resetStatsBtn = document.getElementById('resetStatsBtn');
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', resetGameStats);
    }
    
    // Кнопки управления данными
    setupDataButtons();
}

// Переключение вкладок
function switchTab(tabId) {
    // Обновляем активные кнопки вкладок
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Обновляем активные вкладки контента
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.id === `${tabId}Tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Закрытие модального окна настроек
function closeSettingsModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Обновление UI настроек
function updateSettingsUI() {
    if (!window.appSettings) return;
    
    const settings = window.appSettings;
    
    // Основные настройки
    const userNameInput = document.getElementById('userName');
    const userClassSelect = document.getElementById('userClass');
    const userBioTextarea = document.getElementById('userBio');
    
    if (userNameInput) userNameInput.value = settings.userName;
    if (userClassSelect) userClassSelect.value = settings.userClass;
    if (userBioTextarea) userBioTextarea.value = settings.userBio;
    
    // Учебные настройки
    const showComplexFormulas = document.getElementById('showComplexFormulas');
    const autoSaveBlog = document.getElementById('autoSaveBlog');
    const showHints = document.getElementById('showHints');
    
    if (showComplexFormulas) showComplexFormulas.checked = settings.showComplexFormulas;
    if (autoSaveBlog) autoSaveBlog.checked = settings.autoSaveBlog;
    if (showHints) showHints.checked = settings.showHints;
    
    // Внешний вид
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === settings.theme) {
            option.classList.add('active');
        }
    });
    
    const fontSizeBtns = document.querySelectorAll('.font-size-btn');
    fontSizeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === settings.fontSize) {
            btn.classList.add('active');
        }
    });
    
    const animationSpeedSelect = document.getElementById('animationSpeed');
    if (animationSpeedSelect) animationSpeedSelect.value = settings.animationSpeed;
    
    // Настройки игр
    const gameDifficultySelect = document.getElementById('gameDifficulty');
    const soundEffects = document.getElementById('soundEffects');
    const vibration = document.getElementById('vibration');
    const levelTime = document.getElementById('levelTime');
    const timeValue = document.getElementById('timeValue');
    
    if (gameDifficultySelect) gameDifficultySelect.value = settings.gameDifficulty;
    if (soundEffects) soundEffects.checked = settings.soundEffects;
    if (vibration) vibration.checked = settings.vibration;
    if (levelTime) levelTime.value = settings.levelTime;
    if (timeValue) timeValue.textContent = settings.levelTime;
    
    // Уведомления
    const notifyAchievements = document.getElementById('notifyAchievements');
    const notifyDailyFacts = document.getElementById('notifyDailyFacts');
    const notifyStudyReminders = document.getElementById('notifyStudyReminders');
    const reminderTime = document.getElementById('reminderTime');
    
    if (notifyAchievements) notifyAchievements.checked = settings.notifyAchievements;
    if (notifyDailyFacts) notifyDailyFacts.checked = settings.notifyDailyFacts;
    if (notifyStudyReminders) notifyStudyReminders.checked = settings.notifyStudyReminders;
    if (reminderTime) reminderTime.value = settings.reminderTime;
}

// Сохранение настроек
function saveSettings() {
    if (!window.appSettings) return;
    
    const settings = { ...window.appSettings };
    
    // Основные настройки
    const userNameInput = document.getElementById('userName');
    const userClassSelect = document.getElementById('userClass');
    const userBioTextarea = document.getElementById('userBio');
    
    if (userNameInput) settings.userName = userNameInput.value;
    if (userClassSelect) settings.userClass = userClassSelect.value;
    if (userBioTextarea) settings.userBio = userBioTextarea.value;
    
    // Учебные настройки
    const showComplexFormulas = document.getElementById('showComplexFormulas');
    const autoSaveBlog = document.getElementById('autoSaveBlog');
    const showHints = document.getElementById('showHints');
    
    if (showComplexFormulas) settings.showComplexFormulas = showComplexFormulas.checked;
    if (autoSaveBlog) settings.autoSaveBlog = autoSaveBlog.checked;
    if (showHints) settings.showHints = showHints.checked;
    
    // Внешний вид
    const activeTheme = document.querySelector('.theme-option.active');
    if (activeTheme) settings.theme = activeTheme.dataset.theme;
    
    const activeFontSize = document.querySelector('.font-size-btn.active');
    if (activeFontSize) settings.fontSize = activeFontSize.dataset.size;
    
    const animationSpeedSelect = document.getElementById('animationSpeed');
    if (animationSpeedSelect) settings.animationSpeed = animationSpeedSelect.value;
    
    // Настройки игр
    const gameDifficultySelect = document.getElementById('gameDifficulty');
    const soundEffects = document.getElementById('soundEffects');
    const vibration = document.getElementById('vibration');
    const levelTime = document.getElementById('levelTime');
    
    if (gameDifficultySelect) settings.gameDifficulty = gameDifficultySelect.value;
    if (soundEffects) settings.soundEffects = soundEffects.checked;
    if (vibration) settings.vibration = vibration.checked;
    if (levelTime) settings.levelTime = parseInt(levelTime.value);
    
    // Уведомления
    const notifyAchievements = document.getElementById('notifyAchievements');
    const notifyDailyFacts = document.getElementById('notifyDailyFacts');
    const notifyStudyReminders = document.getElementById('notifyStudyReminders');
    const reminderTime = document.getElementById('reminderTime');
    
    if (notifyAchievements) settings.notifyAchievements = notifyAchievements.checked;
    if (notifyDailyFacts) settings.notifyDailyFacts = notifyDailyFacts.checked;
    if (notifyStudyReminders) settings.notifyStudyReminders = notifyStudyReminders.checked;
    if (reminderTime) settings.reminderTime = reminderTime.value;
    
    // Сохраняем настройки
    localStorage.setItem('bioChemSettings', JSON.stringify(settings));
    window.appSettings = settings;
    
    // Применяем настройки
    applySettings(settings);
    
    // Показываем уведомление
    showNotification('Настройки сохранены!', 'success');
    
    // Закрываем модальное окно
    closeSettingsModal();
}

// Обновление статистики игр
function updateGameStats() {
    const totalGamesPlayed = document.getElementById('totalGamesPlayed');
    const bestMoleculeScore = document.getElementById('bestMoleculeScore');
    const levelsCompleted = document.getElementById('levelsCompleted');
    
    if (totalGamesPlayed) {
        const gamesPlayed = localStorage.getItem('totalGamesPlayed') || '0';
        totalGamesPlayed.textContent = gamesPlayed;
    }
    
    if (bestMoleculeScore) {
        const highScore = localStorage.getItem('moleculeHighScore') || '0';
        bestMoleculeScore.textContent = highScore;
    }
    
    if (levelsCompleted) {
        const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
        levelsCompleted.textContent = completedLevels.length;
    }
}

// Сброс статистики игр
function resetGameStats() {
    if (confirm('Вы уверены, что хотите сбросить всю статистику игр? Это действие нельзя отменить.')) {
        localStorage.removeItem('totalGamesPlayed');
        localStorage.removeItem('moleculeHighScore');
        localStorage.removeItem('completedLevels');
        
        updateGameStats();
        showNotification('Статистика сброшена', 'info');
    }
}

// Настройка кнопок управления данными
function setupDataButtons() {
    const exportBtn = document.getElementById('exportDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const clearBtn = document.getElementById('clearDataBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAllData);
    }
    
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            importAllData(e.target.result);
                        } catch (error) {
                            showNotification('Ошибка при импорте данных', 'error');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            
            input.click();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllData);
    }
}

// Экспорт всех данных
function exportAllData() {
    const data = {
        settings: window.appSettings,
        blogPosts: JSON.parse(localStorage.getItem('bioChemBlogPosts') || '[]'),
        achievements: JSON.parse(localStorage.getItem('bioChemAchievements') || '[]'),
        studiedElements: JSON.parse(localStorage.getItem('studiedElements') || '[]'),
        gameStats: {
            totalGamesPlayed: localStorage.getItem('totalGamesPlayed') || '0',
            moleculeHighScore: localStorage.getItem('moleculeHighScore') || '0',
            completedLevels: JSON.parse(localStorage.getItem('completedLevels') || '[]')
        },
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `BioChemLab_Data_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Данные экспортированы!', 'success');
}

// Импорт всех данных
function importAllData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        
        if (confirm('Это заменит все текущие данные. Продолжить?')) {
            // Импортируем настройки
            if (data.settings) {
                localStorage.setItem('bioChemSettings', JSON.stringify(data.settings));
                window.appSettings = data.settings;
                applySettings(data.settings);
            }
            
            // Импортируем посты блога
            if (data.blogPosts) {
                localStorage.setItem('bioChemBlogPosts', JSON.stringify(data.blogPosts));
            }
            
            // Импортируем достижения
            if (data.achievements) {
                localStorage.setItem('bioChemAchievements', JSON.stringify(data.achievements));
            }
            
            // Импортируем изученные элементы
            if (data.studiedElements) {
                localStorage.setItem('studiedElements', JSON.stringify(data.studiedElements));
            }
            
            // Импортируем статистику игр
            if (data.gameStats) {
                if (data.gameStats.totalGamesPlayed) {
                    localStorage.setItem('totalGamesPlayed', data.gameStats.totalGamesPlayed);
                }
                if (data.gameStats.moleculeHighScore) {
                    localStorage.setItem('moleculeHighScore', data.gameStats.moleculeHighScore);
                }
                if (data.gameStats.completedLevels) {
                    localStorage.setItem('completedLevels', JSON.stringify(data.gameStats.completedLevels));
                }
            }
            
            showNotification('Данные успешно импортированы!', 'success');
            
            // Обновляем UI
            updateGameStats();
            updateSettingsUI();
            
            // Перезагружаем страницу для применения всех изменений
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (error) {
        showNotification('Ошибка при импорте данных: неверный формат файла', 'error');
    }
}

// Очистка всех данных
function clearAllData() {
    if (confirm('ВНИМАНИЕ: Это удалит ВСЕ данные (настройки, посты, достижения, статистику). Это действие нельзя отменить. Продолжить?')) {
        localStorage.clear();
        showNotification('Все данные очищены', 'info');
        
        // Перезагружаем страницу
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : 
                    type === 'error' ? '#ff6b6b' : 
                    type === 'info' ? '#2196F3' : '#ffd166'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== ПОМОЩЬ =====
function initHelp() {
    setupHelpEventListeners();
}

// Открытие модального окна помощи
function openHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Настройка обработчиков событий помощи
function setupHelpEventListeners() {
    const modal = document.getElementById('helpModal');
    if (!modal) return;
    
    // Закрытие модального окна
    const closeBtn = modal.querySelector('.close-modal');
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    
    if (closeBtn) closeBtn.addEventListener('click', closeHelpModal);
    if (closeHelpBtn) closeHelpBtn.addEventListener('click', closeHelpModal);
    
    // Переключение вкладок помощи
    const helpTabBtns = modal.querySelectorAll('.help-tab-btn');
    helpTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const helpSection = btn.dataset.help;
            switchHelpTab(helpSection);
        });
    });
}

// Закрытие модального окна помощи
function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Переключение вкладок помощи
function switchHelpTab(helpId) {
    // Обновляем активные кнопки вкладок
    const tabBtns = document.querySelectorAll('.help-tab-btn');
    tabBtns.forEach(btn => {
        if (btn.dataset.help === helpId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Обновляем активный контент
    const helpContents = document.querySelectorAll('.help-content');
    helpContents.forEach(content => {
        if (content.id === `${helpId}Help`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Экспорт функций для использования в других файлах
window.openSettingsModal = openSettingsModal;
window.openHelpModal = openHelpModal;
window.getAppSettings = () => window.appSettings || loadSettings();

// Добавляем CSS для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);
