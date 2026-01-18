document.addEventListener('DOMContentLoaded', () => {
    initPeriodicTable();
});

function initPeriodicTable() {
    renderPeriodicTable();
    initTableEventListeners();
    loadStudiedElements();
}

// Полные данные элементов (первые 20 элементов)
const elements = [
    { number: 1, symbol: "H", name: "Водород", mass: "1.008", category: "nonmetal", group: 1, period: 1 },
    { number: 2, symbol: "He", name: "Гелий", mass: "4.003", category: "noble", group: 18, period: 1 },
    { number: 3, symbol: "Li", name: "Литий", mass: "6.941", category: "metal", group: 1, period: 2 },
    { number: 4, symbol: "Be", name: "Бериллий", mass: "9.012", category: "metal", group: 2, period: 2 },
    { number: 5, symbol: "B", name: "Бор", mass: "10.81", category: "metalloid", group: 13, period: 2 },
    { number: 6, symbol: "C", name: "Углерод", mass: "12.01", category: "nonmetal", group: 14, period: 2 },
    { number: 7, symbol: "N", name: "Азот", mass: "14.01", category: "nonmetal", group: 15, period: 2 },
    { number: 8, symbol: "O", name: "Кислород", mass: "16.00", category: "nonmetal", group: 16, period: 2 },
    { number: 9, symbol: "F", name: "Фтор", mass: "19.00", category: "nonmetal", group: 17, period: 2 },
    { number: 10, symbol: "Ne", name: "Неон", mass: "20.18", category: "noble", group: 18, period: 2 },
    { number: 11, symbol: "Na", name: "Натрий", mass: "22.99", category: "metal", group: 1, period: 3 },
    { number: 12, symbol: "Mg", name: "Магний", mass: "24.31", category: "metal", group: 2, period: 3 },
    { number: 13, symbol: "Al", name: "Алюминий", mass: "26.98", category: "metal", group: 13, period: 3 },
    { number: 14, symbol: "Si", name: "Кремний", mass: "28.09", category: "metalloid", group: 14, period: 3 },
    { number: 15, symbol: "P", name: "Фосфор", mass: "30.97", category: "nonmetal", group: 15, period: 3 },
    { number: 16, symbol: "S", name: "Сера", mass: "32.07", category: "nonmetal", group: 16, period: 3 },
    { number: 17, symbol: "Cl", name: "Хлор", mass: "35.45", category: "nonmetal", group: 17, period: 3 },
    { number: 18, symbol: "Ar", name: "Аргон", mass: "39.95", category: "noble", group: 18, period: 3 },
    { number: 19, symbol: "K", name: "Калий", mass: "39.10", category: "metal", group: 1, period: 4 },
    { number: 20, symbol: "Ca", name: "Кальций", mass: "40.08", category: "metal", group: 2, period: 4 },
    { number: 21, symbol: "Sc", name: "Скандий", mass: "44.96", category: "metal", group: 3, period: 4 },
    { number: 22, symbol: "Ti", name: "Титан", mass: "47.87", category: "metal", group: 4, period: 4 },
    { number: 23, symbol: "V", name: "Ванадий", mass: "50.94", category: "metal", group: 5, period: 4 },
    { number: 24, symbol: "Cr", name: "Хром", mass: "52.00", category: "metal", group: 6, period: 4 },
    { number: 25, symbol: "Mn", name: "Марганец", mass: "54.94", category: "metal", group: 7, period: 4 },
    { number: 26, symbol: "Fe", name: "Железо", mass: "55.85", category: "metal", group: 8, period: 4 },
    { number: 27, symbol: "Co", name: "Кобальт", mass: "58.93", category: "metal", group: 9, period: 4 },
    { number: 28, symbol: "Ni", name: "Никель", mass: "58.69", category: "metal", group: 10, period: 4 },
    { number: 29, symbol: "Cu", name: "Медь", mass: "63.55", category: "metal", group: 11, period: 4 },
    { number: 30, symbol: "Zn", name: "Цинк", mass: "65.38", category: "metal", group: 12, period: 4 }
];

// Подробная информация об элементах
const elementDetails = {
    "H": {
        description: "Самый легкий и распространенный элемент во Вселенной",
        facts: [
            "Составляет 75% массы Вселенной",
            "Горит голубым пламенем",
            "Используется в топливных элементах"
        ],
        uses: ["Производство аммиака", "Гидрогенизация жиров", "Ракетное топливо"],
        discovery: "1766 год, Генри Кавендиш"
    },
    "He": {
        description: "Второй по легкости и распространенности элемент",
        facts: [
            "Не образует химических соединений",
            "Имеет самую низкую температуру кипения",
            "Используется для охлаждения"
        ],
        uses: ["Дирижабли", "Криогеника", "Сварка"],
        discovery: "1868 год, Пьер Жансен"
    },
    "Li": {
        description: "Самый легкий металл",
        facts: [
            "Плавает в воде",
            "Используется в батареях",
            "Придает пламени красный цвет"
        ],
        uses: ["Аккумуляторы", "Керамика", "Медицина"],
        discovery: "1817 год, Йохан Арфведсон"
    },
    "O": {
        description: "Жизненно важный элемент для дыхания и горения",
        facts: [
            "Составляет 21% атмосферы Земли",
            "Самое распространенное вещество в земной коре",
            "Озон (O₃) защищает от ультрафиолета"
        ],
        uses: ["Медицина", "Металлургия", "Водоочистка"],
        discovery: "1774 год, Джозеф Пристли"
    }
    // Можно добавить информацию для остальных элементов
};

function renderPeriodicTable(filterCategory = 'all') {
    const container = document.getElementById('periodicTable');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Создаем 10 периодов (строк) и 18 групп (колонок)
    for (let period = 1; period <= 7; period++) {
        for (let group = 1; group <= 18; group++) {
            const cell = document.createElement('div');
            cell.className = 'table-cell';
            
            // Находим элемент для этой ячейки
            const element = elements.find(e => e.period === period && e.group === group);
            
            if (element && (filterCategory === 'all' || element.category === filterCategory)) {
                cell.innerHTML = `
                    <div class="element ${element.category}" 
                         data-symbol="${element.symbol}"
                         data-number="${element.number}"
                         title="${element.name} (${element.symbol}) - ${element.mass}">
                        <div class="element-number">${element.number}</div>
                        <div class="element-symbol">${element.symbol}</div>
                        <div class="element-name">${element.name}</div>
                    </div>
                `;
            } else {
                // Пустая ячейка
                cell.innerHTML = '<div class="element empty"></div>';
            }
            
            container.appendChild(cell);
        }
    }
    
    // Добавляем обработчики для элементов
    addElementEventListeners();
}

function initTableEventListeners() {
    // Фильтры категорий
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            renderPeriodicTable(category);
        });
    });
    
    // Поиск
    const searchInput = document.getElementById('elementSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query === '') {
                // Показываем все элементы
                document.querySelectorAll('.element').forEach(el => {
                    el.parentElement.style.display = 'block';
                    el.classList.remove('highlight');
                });
                return;
            }
            
            document.querySelectorAll('.element').forEach(el => {
                const symbol = el.dataset.symbol ? el.dataset.symbol.toLowerCase() : '';
                const name = el.querySelector('.element-name') ? 
                           el.querySelector('.element-name').textContent.toLowerCase() : '';
                const number = el.dataset.number || '';
                
                if (symbol.includes(query) || name.includes(query) || number.includes(query)) {
                    el.parentElement.style.display = 'block';
                    el.classList.add('highlight');
                    
                    // Анимация
                    el.style.animation = 'pulse 0.5s';
                    setTimeout(() => {
                        el.style.animation = '';
                    }, 500);
                } else {
                    el.parentElement.style.display = 'none';
                    el.classList.remove('highlight');
                }
            });
        });
    }
}

function addElementEventListeners() {
    document.querySelectorAll('.element:not(.empty)').forEach(element => {
        element.addEventListener('click', () => {
            const symbol = element.dataset.symbol;
            showElementDetails(symbol);
            
            // Отслеживание изученных элементов для достижения
            trackElementStudy(symbol);
        });
        
        // Эффект при наведении
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
            element.style.zIndex = '100';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.zIndex = '1';
        });
    });
}

function showElementDetails(symbol) {
    const element = elements.find(e => e.symbol === symbol);
    if (!element) return;
    
    const details = elementDetails[symbol] || {
        description: "Этот элемент очень важен в химии и имеет множество применений.",
        facts: [
            "Изучается в школьной программе",
            "Имеет уникальные химические свойства",
            "Встречается в природе"
        ],
        uses: ["Промышленное применение", "Научные исследования", "Технологии"],
        discovery: "Давно известен человечеству"
    };
    
    const container = document.getElementById('elementDetails');
    if (!container) return;
    
    // Анимация перехода
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = `
            <div class="details-header">
                <div class="element-title">
                    <h3>${element.name} (${element.symbol})</h3>
                    <span class="element-mass">${element.mass} а.е.м.</span>
                </div>
                <div class="element-badge ${element.category}">
                    ${getCategoryName(element.category)}
                </div>
            </div>
            
            <div class="details-content">
                <div class="element-summary">
                    <p class="element-description">${details.description}</p>
                    
                    <div class="basic-info">
                        <div class="info-item">
                            <span class="info-label">Атомный номер:</span>
                            <span class="info-value">${element.number}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Период:</span>
                            <span class="info-value">${element.period}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Группа:</span>
                            <span class="info-value">${element.group}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Открытие:</span>
                            <span class="info-value">${details.discovery}</span>
                        </div>
                    </div>
                </div>
                
                <div class="element-sections">
                    <div class="section">
                        <h4><i class="fas fa-lightbulb"></i> Интересные факты</h4>
                        <ul>
                            ${details.facts.map(fact => `<li>${fact}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h4><i class="fas fa-industry"></i> Применение</h4>
                        <ul>
                            ${details.uses.map(use => `<li>${use}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="study-progress">
                    <button class="btn study-btn" onclick="markAsStudied('${symbol}')">
                        <i class="fas fa-check"></i> Отметить как изученный
                    </button>
                    <div class="progress-text">
                        Изучено элементов: <span id="studiedCount">0</span>/${elements.length}
                    </div>
                </div>
            </div>
        `;
        
        container.style.opacity = '1';
        
        // Обновляем счетчик изученных элементов
        updateStudiedCount();
        
    }, 300);
}

function getCategoryName(category) {
    const names = {
        metal: "Металл",
        nonmetal: "Неметалл",
        noble: "Благородный газ",
        metalloid: "Полуметалл"
    };
    return names[category] || category;
}

let studiedElements = new Set();

function loadStudiedElements() {
    const saved = localStorage.getItem('studiedElements');
    if (saved) {
        studiedElements = new Set(JSON.parse(saved));
    }
}

function trackElementStudy(symbol) {
    if (!studiedElements.has(symbol)) {
        studiedElements.add(symbol);
        localStorage.setItem('studiedElements', JSON.stringify([...studiedElements]));
        
        // Обновляем отображение
        updateStudiedCount();
        
        // Проверка достижения
        if (studiedElements.size >= 5 && typeof window.unlockAchievement === 'function') {
            window.unlockAchievement('elements_5');
        }
    }
}

function markAsStudied(symbol) {
    trackElementStudy(symbol);
    
    // Показываем уведомление
    const element = elements.find(e => e.symbol === symbol);
    if (element) {
        showNotification(`${element.name} отмечен как изученный!`, 'success');
    }
    
    // Подсвечиваем элемент в таблице
    document.querySelectorAll('.element').forEach(el => {
        if (el.dataset.symbol === symbol) {
            el.classList.add('studied');
            el.innerHTML += '<div class="studied-badge"><i class="fas fa-check"></i></div>';
        }
    });
}

function updateStudiedCount() {
    const countElement = document.getElementById('studiedCount');
    if (countElement) {
        countElement.textContent = studiedElements.size;
    }
    
    // Подсвечиваем изученные элементы в таблице
    document.querySelectorAll('.element').forEach(el => {
        const symbol = el.dataset.symbol;
        if (symbol && studiedElements.has(symbol)) {
            el.classList.add('studied');
            if (!el.querySelector('.studied-badge')) {
                el.innerHTML += '<div class="studied-badge"><i class="fas fa-check"></i></div>';
            }
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
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

// Добавляем CSS стили
const tableStyles = document.createElement('style');
tableStyles.textContent = `
    .periodic-table {
        display: grid;
        grid-template-columns: repeat(18, 1fr);
        grid-template-rows: repeat(7, 1fr);
        gap: 4px;
        margin: 2rem 0;
        background: var(--secondary);
        padding: 15px;
        border-radius: var(--round);
        overflow-x: auto;
        min-height: 500px;
    }
    
    .table-cell {
        aspect-ratio: 1;
        min-width: 50px;
    }
    
    .element {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 5px;
        position: relative;
        border: 2px solid transparent;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .element.empty {
        background: transparent;
        box-shadow: none;
        cursor: default;
    }
    
    .element:hover:not(.empty) {
        transform: scale(1.1);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        border-color: var(--accent);
        z-index: 10;
    }
    
    .element.highlight {
        animation: highlight 0.5s ease;
        border-color: var(--accent2);
        box-shadow: 0 0 10px var(--accent2);
    }
    
    .element.studied {
        border-color: #4CAF50;
        background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
    }
    
    .studied-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #4CAF50;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
    }
    
    .element-number {
        font-size: 0.7rem;
        position: absolute;
        top: 3px;
        left: 5px;
        color: #666;
        font-weight: bold;
    }
    
    .element-symbol {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--dark);
        margin-top: 10px;
    }
    
    .element-name {
        font-size: 0.6rem;
        margin-top: 3px;
        color: #666;
        text-align: center;
        line-height: 1.2;
        padding: 0 2px;
    }
    
    .element.metal { background: linear-gradient(135deg, #ffcccb 0%, #ffb3b3 100%); }
    .element.nonmetal { background: linear-gradient(135deg, #c9e4ff 0%, #a8d0ff 100%); }
    .element.noble { background: linear-gradient(135deg, #d0f0c0 0%, #b8e0a8 100%); }
    .element.metalloid { background: linear-gradient(135deg, #fffacd 0%, #fff0a8 100%); }
    
    .details-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--primary);
    }
    
    .element-title {
        flex-grow: 1;
    }
    
    .element-title h3 {
        margin: 0 0 0.5rem 0;
        color: var(--dark);
        font-size: 1.8rem;
    }
    
    .element-mass {
        font-size: 1rem;
        color: var(--accent2);
        font-weight: 600;
    }
    
    .element-badge {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        color: white;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .element-badge.metal { background: #ff6b6b; }
    .element-badge.nonmetal { background: #4ecdc4; }
    .element-badge.noble { background: #2ecc71; }
    .element-badge.metalloid { background: #ffd166; }
    
    .details-content {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    .basic-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
        padding: 1rem;
        background: var(--secondary);
        border-radius: 10px;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px dashed #ddd;
    }
    
    .info-label {
        color: #666;
        font-weight: 500;
    }
    
    .info-value {
        font-weight: 600;
        color: var(--dark);
    }
    
    .element-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .section h4 {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--accent2);
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--primary);
    }
    
    .section ul {
        padding-left: 1.5rem;
        color: #666;
    }
    
    .section li {
        margin-bottom: 0.5rem;
        line-height: 1.5;
    }
    
    .study-progress {
        margin-top: 2rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        border-radius: var(--round);
        text-align: center;
    }
    
    .study-btn {
        margin-bottom: 1rem;
    }
    
    .progress-text {
        font-size: 1.1rem;
        color: var(--dark);
        font-weight: 600;
    }
    
    #studiedCount {
        color: var(--accent2);
        font-size: 1.3rem;
        font-weight: 800;
    }
    
    @keyframes highlight {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @media (max-width: 1024px) {
        .periodic-table {
            grid-template-columns: repeat(10, 1fr);
            grid-template-rows: repeat(10, 1fr);
        }
    }
    
    @media (max-width: 768px) {
        .periodic-table {
            grid-template-columns: repeat(8, 1fr);
            grid-template-rows: repeat(12, 1fr);
            font-size: 0.8rem;
        }
        
        .element-symbol {
            font-size: 1.2rem;
        }
        
        .element-name {
            font-size: 0.5rem;
        }
        
        .element-sections {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 480px) {
        .periodic-table {
            grid-template-columns: repeat(6, 1fr);
            grid-template-rows: repeat(15, 1fr);
        }
        
        .table-cell {
            min-width: 40px;
        }
        
        .element-symbol {
            font-size: 1rem;
        }
        
        .element-name {
            display: none;
        }
    }
`;
document.head.appendChild(tableStyles);

// Инициализация при загрузке
loadStudiedElements();
updateStudiedCount();

// Экспортируем функцию для использования в кнопке
window.markAsStudied = markAsStudied;