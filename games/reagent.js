// Игра "Угадай реактив"
document.addEventListener('DOMContentLoaded', () => {
    initReagentGame();
});

class ReagentGame {
    constructor() {
        this.score = 0;
        this.streak = 0;
        this.timeLeft = 60;
        this.timer = null;
        this.gameActive = false;
        this.currentReagent = null;
        this.options = [];
        this.hintsUsed = [];
        this.highScore = parseInt(localStorage.getItem('reagentHighScore')) || 0;
        
        // База данных реактивов
        this.reagents = [
            {
                id: 1,
                name: "Вода",
                formula: "H₂O",
                description: "Прозрачная жидкость без цвета, вкуса и запаха. Универсальный растворитель.",
                color: "Бесцветная",
                smell: "Без запаха",
                reactions: [
                    "Реагирует с активными металлами (Na, K)",
                    "Вступает в реакцию гидратации с оксидами",
                    "Подвергается электролизу"
                ],
                uses: ["Растворитель", "Охлаждающая жидкость", "Пожаротушение"],
                difficulty: "easy"
            },
            {
                id: 2,
                name: "Соляная кислота",
                formula: "HCl",
                description: "Раствор хлороводорода в воде. Сильная кислота.",
                color: "Бесцветная, может иметь желтоватый оттенок",
                smell: "Резкий, удушливый",
                reactions: [
                    "Реагирует с металлами с выделением водорода",
                    "Нейтрализуется щелочами",
                    "Растворяет многие металлы и их оксиды"
                ],
                uses: ["Производство хлоридов", "Очистка металлов", "Пищевая промышленность"],
                difficulty: "medium"
            },
            {
                id: 3,
                name: "Аммиак",
                formula: "NH₃",
                description: "Бесцветный газ с резким характерным запахом. Хорошо растворим в воде.",
                color: "Бесцветный",
                smell: "Резкий, характерный (нашатырный спирт)",
                reactions: [
                    "Образует комплексные соединения с ионами металлов",
                    "Реагирует с кислотами с образованием солей аммония",
                    "Окисляется кислородом"
                ],
                uses: ["Производство удобрений", "Холодильные установки", "Производство пластмасс"],
                difficulty: "medium"
            },
            {
                id: 4,
                name: "Перманганат калия",
                formula: "KMnO₄",
                description: "Темно-фиолетовые кристаллы, растворимые в воде с образованием малинового раствора.",
                color: "Темно-фиолетовые кристаллы, малиновый раствор",
                smell: "Без запаха",
                reactions: [
                    "Сильный окислитель в кислой среде",
                    "Восстанавливается до бесцветных соединений",
                    "Разлагается при нагревании"
                ],
                uses: ["Дезинфекция", "Окислитель в химическом синтезе", "Аналитическая химия"],
                difficulty: "hard"
            },
            {
                id: 5,
                name: "Гидроксид натрия",
                formula: "NaOH",
                description: "Белые непрозрачные кристаллы, очень гигроскопичны. Сильная щелочь.",
                color: "Белые кристаллы, бесцветный раствор",
                smell: "Без запаха",
                reactions: [
                    "Бурно реагирует с водой с выделением тепла",
                    "Нейтрализуется кислотами",
                    "Реагирует с амфотерными металлами"
                ],
                uses: ["Производство мыла", "Бумажная промышленность", "Очистка нефтепродуктов"],
                difficulty: "medium"
            },
            {
                id: 6,
                name: "Медный купорос",
                formula: "CuSO₄·5H₂O",
                description: "Синие прозрачные кристаллы. При нагревании теряет воду и становится белым.",
                color: "Синие кристаллы, голубой раствор",
                smell: "Без запаха",
                reactions: [
                    "Реагирует с железом (железо вытесняет медь)",
                    "Образует ярко-синий комплекс с аммиаком",
                    "При нагревании обезвоживается"
                ],
                uses: ["Протравливание семян", "Получение других соединений меди", "Электролиты"],
                difficulty: "hard"
            },
            {
                id: 7,
                name: "Серная кислота",
                formula: "H₂SO₄",
                description: "Маслянистая бесцветная жидкость. Одна из самых сильных кислот.",
                color: "Бесцветная, может быть желтоватой",
                smell: "Без запаха",
                reactions: [
                    "Сильно обезвоживает органические вещества",
                    "Бурно реагирует с водой с выделением тепла",
                    "Окислитель в концентрированном виде"
                ],
                uses: ["Производство удобрений", "Аккумуляторные батареи", "Нефтепереработка"],
                difficulty: "hard"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadHighScore();
        this.setupEventListeners();
        this.startNewQuestion();
        this.gameActive = true;
        this.startTimer();
        this.updateDisplay();
    }
    
    loadHighScore() {
        const highScoreElement = document.getElementById('highScore');
        if (highScoreElement) {
            highScoreElement.textContent = this.highScore;
        }
    }
    
    setupEventListeners() {
        // Кнопки управления
        const skipBtn = document.getElementById('skipBtn');
        const nextBtn = document.getElementById('nextBtn');
        const continueBtn = document.getElementById('continueBtn');
        const backToMenuBtn = document.getElementById('backToMenuBtn');
        
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (continueBtn) continueBtn.addEventListener('click', () => this.continueGame());
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                window.location.href = '../index.html#games';
            });
        }
        
        // Подсказки
        const colorHintBtn = document.getElementById('colorHintBtn');
        const smellHintBtn = document.getElementById('smellHintBtn');
        const reactionHintBtn = document.getElementById('reactionHintBtn');
        
        if (colorHintBtn) colorHintBtn.addEventListener('click', () => this.showHint('color'));
        if (smellHintBtn) smellHintBtn.addEventListener('click', () => this.showHint('smell'));
        if (reactionHintBtn) reactionHintBtn.addEventListener('click', () => this.showHint('reaction'));
        
        // Модальное окно
        const closeModalBtn = document.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeResultModal());
        }
    }
    
    startNewQuestion() {
        this.hintsUsed = [];
        
        // Выбираем случайный реактив
        const availableReagents = this.getAvailableReagents();
        this.currentReagent = availableReagents[Math.floor(Math.random() * availableReagents.length)];
        
        // Создаем варианты ответов (1 правильный + 3 неправильных)
        this.options = this.generateOptions();
        
        // Обновляем интерфейс
        this.updateQuestionDisplay();
        this.updateOptionsDisplay();
        this.clearHintsDisplay();
    }
    
    getAvailableReagents() {
        // Можно добавить фильтрацию по сложности в будущем
        return this.reagents;
    }
    
    generateOptions() {
        const options = [this.currentReagent];
        
        // Добавляем 3 случайных неправильных варианта
        while (options.length < 4) {
            const randomReagent = this.reagents[Math.floor(Math.random() * this.reagents.length)];
            if (!options.includes(randomReagent)) {
                options.push(randomReagent);
            }
        }
        
        // Перемешиваем варианты
        return this.shuffleArray(options);
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    updateQuestionDisplay() {
        const descriptionText = document.getElementById('descriptionText');
        if (descriptionText) {
            descriptionText.textContent = this.currentReagent.description;
        }
    }
    
    updateOptionsDisplay() {
        const answerOptions = document.getElementById('answerOptions');
        if (!answerOptions) return;
        
        answerOptions.innerHTML = '';
        
        this.options.forEach((reagent, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'answer-option';
            optionBtn.dataset.index = index;
            optionBtn.innerHTML = `
                <div class="option-content">
                    <div class="option-name">${reagent.name}</div>
                    <div class="option-formula">${reagent.formula}</div>
                </div>
            `;
            
            optionBtn.addEventListener('click', () => this.checkAnswer(reagent));
            
            answerOptions.appendChild(optionBtn);
        });
    }
    
    checkAnswer(selectedReagent) {
        if (!this.gameActive) return;
        
        const isCorrect = selectedReagent.id === this.currentReagent.id;
        
        // Вычисляем очки
        let points = 0;
        let message = '';
        
        if (isCorrect) {
            // Базовые очки за сложность
            points = this.getDifficultyPoints(this.currentReagent.difficulty);
            
            // Бонус за серию
            this.streak++;
            const streakBonus = Math.min(this.streak * 10, 50);
            points += streakBonus;
            
            // Штраф за подсказки
            const hintPenalty = this.hintsUsed.length * 5;
            points = Math.max(10, points - hintPenalty);
            
            // Бонус за время
            const timeBonus = Math.floor(this.timeLeft / 10);
            points += timeBonus;
            
            this.score += points;
            message = `Правильно! ${this.currentReagent.name} - ${this.currentReagent.formula}`;
            
            // Обновляем рекорд
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('reagentHighScore', this.highScore);
                this.loadHighScore();
            }
            
            // Обновляем статистику игр
            this.updateGamesPlayed();
        } else {
            this.streak = 0;
            points = -20;
            this.score = Math.max(0, this.score + points);
            message = `Неправильно! Это ${this.currentReagent.name} (${this.currentReagent.formula})`;
        }
        
        // Показываем результат
        this.showResult(isCorrect, points, message);
        
        // Останавливаем игру на время показа результата
        this.gameActive = false;
        clearInterval(this.timer);
    }
    
    getDifficultyPoints(difficulty) {
        switch(difficulty) {
            case 'easy': return 50;
            case 'medium': return 75;
            case 'hard': return 100;
            default: return 50;
        }
    }
    
    showResult(isCorrect, points, message) {
        const modal = document.getElementById('resultModal');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const answerScore = document.getElementById('answerScore');
        const currentStreak = document.getElementById('currentStreak');
        const totalScore = document.getElementById('totalScore');
        const reagentInfo = document.getElementById('reagentInfo');
        const continueBtn = document.getElementById('continueBtn');
        
        if (!modal) return;
        
        if (isCorrect) {
            icon.className = 'result-icon success';
            icon.innerHTML = '<i class="fas fa-trophy"></i>';
            title.textContent = 'Правильно!';
            
            // Разблокируем достижение если это первая игра
            if (typeof window.unlockAchievement === 'function') {
                // Проверяем, играли ли уже в эту игру
                const gamesPlayed = localStorage.getItem('totalReagentGames') || '0';
                if (parseInt(gamesPlayed) === 1) {
                    window.unlockAchievement('first_game');
                }
            }
        } else {
            icon.className = 'result-icon fail';
            icon.innerHTML = '<i class="fas fa-times-circle"></i>';
            title.textContent = 'Неправильно';
        }
        
        resultMessage.textContent = message;
        answerScore.textContent = points > 0 ? `+${points}` : points;
        currentStreak.textContent = this.streak;
        totalScore.textContent = this.score;
        
        // Показываем информацию о реактиве
        if (reagentInfo) {
            reagentInfo.innerHTML = `
                <div class="reagent-details">
                    <h4>Информация о веществе:</h4>
                    <div class="detail-item">
                        <span class="detail-label">Цвет:</span>
                        <span class="detail-value">${this.currentReagent.color}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Запах:</span>
                        <span class="detail-value">${this.currentReagent.smell}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Характерные реакции:</span>
                        <ul>
                            ${this.currentReagent.reactions.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Применение:</span>
                        <ul>
                            ${this.currentReagent.uses.map(u => `<li>${u}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        // Обновляем текст кнопки продолжения
        if (continueBtn) {
            continueBtn.innerHTML = isCorrect ? 
                '<i class="fas fa-forward"></i> Следующий вопрос' :
                '<i class="fas fa-redo"></i> Попробовать еще';
        }
        
        modal.classList.add('active');
    }
    
    showHint(hintType) {
        if (!this.gameActive || this.hintsUsed.includes(hintType)) return;
        
        // Стоимость подсказки
        const hintCost = {
            color: 5,
            smell: 10,
            reaction: 15
        }[hintType];
        
        if (this.score < hintCost) {
            this.showMessage("Недостаточно очков для подсказки!", "warning");
            return;
        }
        
        // Вычитаем очки
        this.score -= hintCost;
        this.hintsUsed.push(hintType);
        
        // Показываем подсказку
        const hintsDisplay = document.getElementById('hintsDisplay');
        if (hintsDisplay) {
            let hintText = '';
            
            switch(hintType) {
                case 'color':
                    hintText = `Цвет: ${this.currentReagent.color}`;
                    break;
                case 'smell':
                    hintText = `Запах: ${this.currentReagent.smell}`;
                    break;
                case 'reaction':
                    const randomReaction = this.currentReagent.reactions[
                        Math.floor(Math.random() * this.currentReagent.reactions.length)
                    ];
                    hintText = `Реакция: ${randomReaction}`;
                    break;
            }
            
            const hintElement = document.createElement('div');
            hintElement.className = 'hint-item';
            hintElement.innerHTML = `
                <i class="fas fa-lightbulb"></i>
                <span>${hintText}</span>
                <span class="hint-cost">-${hintCost}</span>
            `;
            
            hintsDisplay.appendChild(hintElement);
        }
        
        this.updateDisplay();
    }
    
    skipQuestion() {
        if (!this.gameActive || this.score < 20) {
            this.showMessage("Недостаточно очков для пропуска!", "warning");
            return;
        }
        
        this.score -= 20;
        this.streak = 0;
        this.nextQuestion();
        this.updateDisplay();
    }
    
    nextQuestion() {
        this.closeResultModal();
        this.timeLeft = 60;
        this.startNewQuestion();
        this.gameActive = true;
        this.startTimer();
        this.updateDisplay();
    }
    
    continueGame() {
        this.closeResultModal();
        this.nextQuestion();
    }
    
    closeResultModal() {
        const modal = document.getElementById('resultModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    clearHintsDisplay() {
        const hintsDisplay = document.getElementById('hintsDisplay');
        if (hintsDisplay) {
            hintsDisplay.innerHTML = '';
        }
    }
    
    startTimer() {
        clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (!this.gameActive) return;
            
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    timeUp() {
        clearInterval(this.timer);
        this.gameActive = false;
        
        // Показываем результат
        const message = `Время вышло! Это был ${this.currentReagent.name} (${this.currentReagent.formula})`;
        this.showResult(false, 0, message);
    }
    
    updateDisplay() {
        // Очки и серия
        const scoreDisplay = document.getElementById('scoreDisplay');
        const streakDisplay = document.getElementById('streakDisplay');
        
        if (scoreDisplay) scoreDisplay.textContent = `Очки: ${this.score}`;
        if (streakDisplay) streakDisplay.textContent = `Серия: ${this.streak}`;
        
        // Таймер
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Цвет таймера при малом времени
            if (this.timeLeft < 10) {
                timerElement.style.color = '#ff6b6b';
                timerElement.classList.add('blink');
            } else {
                timerElement.style.color = '';
                timerElement.classList.remove('blink');
            }
        }
    }
    
    updateGamesPlayed() {
        let totalGames = parseInt(localStorage.getItem('totalReagentGames') || '0');
        totalGames++;
        localStorage.setItem('totalReagentGames', totalGames.toString());
        
        // Обновляем общую статистику игр
        let totalAllGames = parseInt(localStorage.getItem('totalGamesPlayed') || '0');
        totalAllGames++;
        localStorage.setItem('totalGamesPlayed', totalAllGames.toString());
    }
    
    showMessage(text, type = "info") {
        // Создаем временное сообщение
        const messageDiv = document.createElement('div');
        messageDiv.className = `game-message ${type}`;
        messageDiv.textContent = text;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            background: ${type === 'error' ? '#ff6b6b' : 
                        type === 'warning' ? '#ffd166' : 
                        type === 'hint' ? '#4ecdc4' : '#2c3e50'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

function initReagentGame() {
    window.reagentGame = new ReagentGame();
}

// Добавляем CSS анимации
const gameStyles = document.createElement('style');
gameStyles.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .blink {
        animation: blink 1s infinite;
    }
    
    .game-message {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        background: var(--accent2);
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideDown 0.3s ease;
        text-align: center;
        max-width: 80%;
    }
    
    .reagent-details {
        text-align: left;
        margin: 1.5rem 0;
        padding: 1rem;
        background: rgba(168, 230, 207, 0.1);
        border-radius: 10px;
        border-left: 3px solid var(--primary);
    }
    
    .reagent-details h4 {
        color: var(--accent2);
        margin-bottom: 1rem;
    }
    
    .detail-item {
        margin-bottom: 1rem;
    }
    
    .detail-label {
        font-weight: 600;
        color: var(--dark);
        display: block;
        margin-bottom: 0.3rem;
    }
    
    .detail-value {
        color: #666;
    }
    
    .reagent-details ul {
        padding-left: 1.5rem;
        color: #666;
    }
    
    .reagent-details li {
        margin-bottom: 0.3rem;
        line-height: 1.5;
    }
`;
document.head.appendChild(gameStyles);