// Игра "Собери молекулу" - с скрытыми формулами
document.addEventListener('DOMContentLoaded', () => {
    initMoleculeGame();
});

class MoleculeGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.timeLeft = 90;
        this.timer = null;
        this.gameActive = false;
        this.currentMolecule = null;
        this.placedAtoms = [];
        this.connections = [];
        this.draggedAtom = null;
        this.highScore = parseInt(localStorage.getItem('moleculeHighScore')) || 0;
        this.currentLevelCompleted = false;
        this.wrongAttempts = 0;
        this.hintOffered = false;
        
        // Молекулы для сборки по уровням
        this.moleculesByLevel = {
            1: [
                { 
                    id: 1,
                    formula: "H₂O", 
                    name: "Вода", 
                    atoms: ["H", "H", "O"],
                    structure: "Линейная: H-O-H",
                    description: "Самое распространенное вещество на Земле",
                    difficulty: "easy",
                    hiddenFormula: true,
                    facts: "Вода покрывает 71% поверхности Земли и составляет 60-70% массы человеческого тела."
                }
            ],
            2: [
                { 
                    id: 2,
                    formula: "CO₂", 
                    name: "Углекислый газ", 
                    atoms: ["C", "O", "O"],
                    structure: "Линейная: O=C=O",
                    description: "Важный парниковый газ",
                    difficulty: "easy",
                    hiddenFormula: true,
                    facts: "Растения используют CO₂ для фотосинтеза, производя кислород."
                }
            ],
            3: [
                { 
                    id: 3,
                    formula: "NH₃", 
                    name: "Аммиак", 
                    atoms: ["N", "H", "H", "H"],
                    structure: "Тригональная пирамида",
                    description: "Используется в производстве удобрений",
                    difficulty: "medium",
                    hiddenFormula: true,
                    facts: "Аммиак имеет резкий запах и используется в холодильных установках."
                }
            ],
            4: [
                { 
                    id: 4,
                    formula: "CH₄", 
                    name: "Метан", 
                    atoms: ["C", "H", "H", "H", "H"],
                    structure: "Тетраэдрическая",
                    description: "Основной компонент природного газа",
                    difficulty: "medium",
                    hiddenFormula: true,
                    facts: "Метан в 25 раз более эффективен как парниковый газ, чем CO₂."
                }
            ],
            5: [
                { 
                    id: 5,
                    formula: "HCl", 
                    name: "Соляная кислота", 
                    atoms: ["H", "Cl"],
                    structure: "Линейная: H-Cl",
                    description: "Сильная кислота, раствор хлороводорода в воде",
                    difficulty: "easy",
                    hiddenFormula: true,
                    facts: "Желудочный сок содержит соляную кислоту для переваривания пищи."
                }
            ],
            6: [
                { 
                    id: 6,
                    formula: "H₂O₂", 
                    name: "Пероксид водорода", 
                    atoms: ["H", "H", "O", "O"],
                    structure: "Несимметричная",
                    description: "Используется как антисептик и отбеливатель",
                    difficulty: "hard",
                    hiddenFormula: true,
                    facts: "В концентрации 3% используется для дезинфекции ран."
                }
            ],
            7: [
                { 
                    id: 7,
                    formula: "C₆H₁₂O₆", 
                    name: "Глюкоза", 
                    atoms: ["C", "C", "C", "C", "C", "C", "H", "H", "H", "H", "H", "H", "O", "O", "O", "O", "O", "O"],
                    simplifiedAtoms: ["C", "H", "H", "H", "H", "H", "H", "O", "O", "O", "O", "O", "O"],
                    structure: "Кольцевая структура",
                    description: "Основной источник энергии для клеток",
                    difficulty: "hard",
                    hiddenFormula: true,
                    facts: "Уровень глюкозы в крови регулируется гормоном инсулином."
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.loadHighScore();
        this.setupEventListeners();
        this.startLevel(1);
        this.renderAtomPalette();
    }
    
    loadHighScore() {
        const highScoreElement = document.getElementById('highScore');
        if (highScoreElement) {
            highScoreElement.textContent = this.highScore;
        }
    }
    
    setupEventListeners() {
        // Кнопки управления
        const checkBtn = document.getElementById('checkBtn');
        const clearBtn = document.getElementById('clearBtn');
        const hintBtn = document.getElementById('hintBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (checkBtn) {
            checkBtn.addEventListener('click', () => this.checkMolecule());
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearWorkspace());
        }
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextLevel());
        }
        
        // Модальное окно
        const closeModalBtn = document.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeResultModal());
        }
        
        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.restartLevel());
        }
        
        const backToMenuBtn = document.getElementById('backToMenuBtn');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                window.location.href = '../index.html#games';
            });
        }
        
        // Перетаскивание
        this.setupDragAndDrop();
        
        // Обновление таймера
        this.updateDisplay();
    }
    
    startLevel(level) {
        this.level = level;
        this.timeLeft = 90;
        this.currentLevelCompleted = false;
        this.gameActive = true;
        this.wrongAttempts = 0;
        this.hintOffered = false;
        
        // Получаем молекулу для текущего уровня
        const levelMolecules = this.moleculesByLevel[level];
        if (!levelMolecules || levelMolecules.length === 0) {
            this.showGameCompleted();
            return;
        }
        
        this.currentMolecule = levelMolecules[0];
        
        // Обновляем отображение
        this.updateTargetMolecule();
        
        // Очищаем рабочую область
        this.clearWorkspace();
        
        // Заполняем палитру
        this.renderAtomPalette();
        
        // Запускаем таймер
        this.startTimer();
        
        // Обновляем кнопку следующего уровня
        this.updateNextButton();
        
        // Удаляем старые подсказки
        this.removeOldHints();
    }
    
    updateTargetMolecule() {
        const formulaElement = document.querySelector('.formula');
        const nameElement = document.querySelector('.name');
        
        // Скрываем формулу (показываем только подсказки)
        if (this.currentMolecule.hiddenFormula) {
            if (formulaElement) {
                formulaElement.innerHTML = '<div class="hidden-formula">???</div>';
                formulaElement.classList.add('hidden');
            }
            
            // Показываем уровень сложности вместо формулы
            const difficultyElement = document.createElement('div');
            difficultyElement.className = `difficulty ${this.currentMolecule.difficulty}`;
            difficultyElement.innerHTML = `
                <i class="fas fa-${this.getDifficultyIcon(this.currentMolecule.difficulty)}"></i>
                ${this.getDifficultyText(this.currentMolecule.difficulty)}
            `;
            
            const targetDisplay = document.getElementById('targetDisplay');
            if (targetDisplay) {
                // Удаляем старую сложность если есть
                const oldDifficulty = targetDisplay.querySelector('.difficulty');
                if (oldDifficulty) oldDifficulty.remove();
                
                targetDisplay.insertBefore(difficultyElement, targetDisplay.querySelector('.name'));
            }
        } else {
            if (formulaElement) {
                formulaElement.textContent = this.currentMolecule.formula;
                formulaElement.classList.remove('hidden');
            }
        }
        
        // Показываем название и описание
        if (nameElement) {
            nameElement.textContent = this.currentMolecule.name;
        }
        
        // Добавляем/обновляем описание
        const targetDisplay = document.getElementById('targetDisplay');
        if (targetDisplay) {
            let description = targetDisplay.querySelector('.description');
            if (!description) {
                description = document.createElement('div');
                description.className = 'description';
                targetDisplay.appendChild(description);
            }
            description.textContent = this.currentMolecule.description;
            
            // Добавляем подсказки о составе (частично скрытые)
            const hintElement = document.createElement('div');
            hintElement.className = 'composition-hint';
            
            // Показываем количество атомов, но не какие именно
            const atomCount = this.currentMolecule.atoms.length;
            const uniqueElements = [...new Set(this.currentMolecule.atoms)];
            const elementCounts = {};
            
            this.currentMolecule.atoms.forEach(atom => {
                elementCounts[atom] = (elementCounts[atom] || 0) + 1;
            });
            
            let hintText = `Молекула состоит из ${atomCount} атомов`;
            if (this.level <= 3) {
                hintText += `. Содержит ${uniqueElements.length} вида атомов.`;
            } else if (this.level <= 5) {
                const elementList = uniqueElements.map(el => {
                    const count = elementCounts[el];
                    return `${el} (${count})`;
                }).join(', ');
                hintText += `. Состав: ${elementList}`;
            } else {
                hintText += `. В молекуле присутствуют: ${uniqueElements.join(', ')}`;
            }
            
            hintElement.textContent = hintText;
            
            // Удаляем старую подсказку если есть
            const oldHint = targetDisplay.querySelector('.composition-hint');
            if (oldHint) oldHint.remove();
            targetDisplay.appendChild(hintElement);
        }
    }
    
    getDifficultyIcon(difficulty) {
        switch(difficulty) {
            case 'easy': return 'seedling';
            case 'medium': return 'tree';
            case 'hard': return 'mountain';
            default: return 'question';
        }
    }
    
    getDifficultyText(difficulty) {
        switch(difficulty) {
            case 'easy': return 'Легкий уровень';
            case 'medium': return 'Средний уровень';
            case 'hard': return 'Сложный уровень';
            default: return 'Неизвестная сложность';
        }
    }
    
    renderAtomPalette() {
        const palette = document.getElementById('atomPalette');
        if (!palette) return;
        
        palette.innerHTML = '';
        
        // Получаем уникальные атомы для текущей молекулы
        const uniqueAtoms = [...new Set(this.currentMolecule.atoms)];
        
        // Добавляем нужные атомы (с запасом)
        const atomsToAdd = [];
        uniqueAtoms.forEach(atom => {
            // Добавляем по 2-3 каждого атома
            const count = this.currentMolecule.atoms.filter(a => a === atom).length;
            for (let i = 0; i < Math.max(count, 2); i++) {
                atomsToAdd.push(atom);
            }
        });
        
        // Добавляем немного лишних атомов для сложности (только с уровня 3)
        if (this.level >= 3) {
            const extraAtoms = ['C', 'N', 'Cl'].filter(a => !uniqueAtoms.includes(a));
            if (extraAtoms.length > 0) {
                for (let i = 0; i < 2; i++) {
                    atomsToAdd.push(extraAtoms[Math.floor(Math.random() * extraAtoms.length)]);
                }
            }
        }
        
        // Перемешиваем
        this.shuffleArray(atomsToAdd);
        
        // Создаем атомы
        atomsToAdd.forEach((symbol, index) => {
            const atomDiv = this.createAtomElement(symbol);
            palette.appendChild(atomDiv);
        });
    }
    
    createAtomElement(symbol) {
        const atomDiv = document.createElement('div');
        atomDiv.className = `atom ${symbol}`;
        atomDiv.dataset.symbol = symbol;
        atomDiv.dataset.id = `atom-${Date.now()}-${Math.random()}`;
        
        const atomInfo = this.getAtomInfo(symbol);
        
        atomDiv.innerHTML = `
            <div class="atom-symbol">${symbol}</div>
            <div class="atom-name">${atomInfo.name}</div>
        `;
        
        atomDiv.style.background = atomInfo.color;
        
        // События перетаскивания
        atomDiv.setAttribute('draggable', 'true');
        atomDiv.addEventListener('dragstart', (e) => this.dragStart(e));
        atomDiv.addEventListener('click', (e) => {
            if (this.gameActive) {
                this.createAtomInWorkspace(symbol, e);
            }
        });
        
        return atomDiv;
    }
    
    getAtomInfo(symbol) {
        const atoms = {
            "H": { name: "Водород", color: "#ff6b6b" },
            "O": { name: "Кислород", color: "#4ecdc4" },
            "C": { name: "Углерод", color: "#2c3e50" },
            "N": { name: "Азот", color: "#3498db" },
            "Cl": { name: "Хлор", color: "#2ecc71" }
        };
        return atoms[symbol] || { name: symbol, color: "#ccc" };
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    setupDragAndDrop() {
        const dropZone = document.querySelector('.construction-area');
        if (!dropZone) return;
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('active');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('active');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('active');
            
            if (this.draggedAtom && this.gameActive) {
                const rect = dropZone.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.createAtomInWorkspace(this.draggedAtom, { clientX: e.clientX, clientY: e.clientY });
                this.draggedAtom = null;
            }
        });
    }
    
    dragStart(e) {
        if (!this.gameActive) return;
        this.draggedAtom = e.target.dataset.symbol;
        e.dataTransfer.setData('text/plain', e.target.dataset.symbol);
        
        // Эффект перетаскивания
        e.target.style.opacity = '0.5';
        setTimeout(() => {
            if (e.target) e.target.style.opacity = '1';
        }, 100);
    }
    
    createAtomInWorkspace(symbol, event) {
        if (!this.gameActive) return;
        
        const workspace = document.getElementById('constructionArea');
        const rect = workspace.getBoundingClientRect();
        
        // Проверяем, не превысили ли максимальное количество атомов
        const maxAtoms = this.currentMolecule.atoms.length + 2; // +2 для ошибок
        if (this.placedAtoms.length >= maxAtoms) {
            this.showMessage("Слишком много атомов! Уберите лишние.", "warning");
            return;
        }
        
        // Позиция атома
        let posX, posY;
        
        if (event.clientX && event.clientY) {
            // Если событие от мыши
            posX = event.clientX - rect.left - 30;
            posY = event.clientY - rect.top - 30;
        } else {
            // Случайная позиция в центре
            posX = (rect.width / 2) - 30 + (Math.random() * 60 - 30);
            posY = (rect.height / 2) - 30 + (Math.random() * 60 - 30);
        }
        
        // Ограничиваем позицию в пределах рабочей области
        posX = Math.max(10, Math.min(posX, rect.width - 70));
        posY = Math.max(10, Math.min(posY, rect.height - 70));
        
        // Создаем атом
        const atomDiv = document.createElement('div');
        atomDiv.className = `placed-atom atom ${symbol}`;
        atomDiv.dataset.symbol = symbol;
        atomDiv.dataset.id = `placed-${Date.now()}-${Math.random()}`;
        atomDiv.style.left = `${posX}px`;
        atomDiv.style.top = `${posY}px`;
        
        const atomInfo = this.getAtomInfo(symbol);
        atomDiv.style.background = atomInfo.color;
        atomDiv.innerHTML = `
            <div class="atom-symbol">${symbol}</div>
            <div class="atom-name">${atomInfo.name}</div>
        `;
        
        // Делаем перетаскиваемым внутри рабочей области
        this.makeAtomDraggable(atomDiv);
        
        workspace.appendChild(atomDiv);
        
        // Сохраняем информацию об атоме
        const atomData = {
            element: atomDiv,
            symbol: symbol,
            x: posX + 30,
            y: posY + 30,
            id: atomDiv.dataset.id
        };
        
        this.placedAtoms.push(atomData);
        
        // Автоматически создаем связи
        setTimeout(() => this.createConnections(), 100);
        
        // Воспроизводим звук (опционально)
        this.playSound('place');
    }
    
    makeAtomDraggable(atomElement) {
        let isDragging = false;
        let offsetX, offsetY;
        
        atomElement.addEventListener('mousedown', (e) => {
            if (!this.gameActive) return;
            
            isDragging = true;
            const rect = atomElement.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            
            atomElement.style.zIndex = '100';
            atomElement.style.cursor = 'grabbing';
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !this.gameActive) return;
            
            const workspace = document.getElementById('constructionArea');
            const rect = workspace.getBoundingClientRect();
            
            let posX = e.clientX - rect.left - offsetX;
            let posY = e.clientY - rect.top - offsetY;
            
            // Ограничиваем позицию
            posX = Math.max(0, Math.min(posX, rect.width - 60));
            posY = Math.max(0, Math.min(posY, rect.height - 60));
            
            atomElement.style.left = `${posX}px`;
            atomElement.style.top = `${posY}px`;
            
            // Обновляем данные атома
            const atomId = atomElement.dataset.id;
            const atomIndex = this.placedAtoms.findIndex(a => a.id === atomId);
            if (atomIndex !== -1) {
                this.placedAtoms[atomIndex].x = posX + 30;
                this.placedAtoms[atomIndex].y = posY + 30;
            }
            
            // Обновляем связи
            this.createConnections();
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                atomElement.style.zIndex = '10';
                atomElement.style.cursor = 'grab';
                
                // Воспроизводим звук
                this.playSound('move');
            }
        });
        
        // Удаление атома по двойному клику
        atomElement.addEventListener('dblclick', () => {
            if (!this.gameActive) return;
            
            const atomId = atomElement.dataset.id;
            const atomIndex = this.placedAtoms.findIndex(a => a.id === atomId);
            
            if (atomIndex !== -1) {
                atomElement.remove();
                this.placedAtoms.splice(atomIndex, 1);
                this.createConnections();
                this.playSound('remove');
            }
        });
        
        atomElement.style.cursor = 'grab';
    }
    
    createConnections() {
        // Очищаем старые связи
        const connectionsDiv = document.getElementById('connections');
        if (!connectionsDiv) return;
        
        connectionsDiv.innerHTML = '';
        this.connections = [];
        
        // Простая логика создания связей
        // Для воды: H-O-H
        if (this.currentMolecule.formula === "H₂O" && this.placedAtoms.length === 3) {
            // Находим атом кислорода
            const oxygenAtoms = this.placedAtoms.filter(a => a.symbol === "O");
            const hydrogenAtoms = this.placedAtoms.filter(a => a.symbol === "H");
            
            if (oxygenAtoms.length === 1 && hydrogenAtoms.length === 2) {
                const oxygen = oxygenAtoms[0];
                
                // Соединяем кислород с каждым водородом
                hydrogenAtoms.forEach(hydrogen => {
                    this.createConnectionElement(oxygen, hydrogen);
                });
            }
        }
        // Для CO₂: O=C=O
        else if (this.currentMolecule.formula === "CO₂" && this.placedAtoms.length === 3) {
            const carbonAtoms = this.placedAtoms.filter(a => a.symbol === "C");
            const oxygenAtoms = this.placedAtoms.filter(a => a.symbol === "O");
            
            if (carbonAtoms.length === 1 && oxygenAtoms.length === 2) {
                const carbon = carbonAtoms[0];
                
                // Соединяем углерод с каждым кислородом
                oxygenAtoms.forEach(oxygen => {
                    this.createConnectionElement(carbon, oxygen, true); // Двойная связь
                });
            }
        }
        // Для других молекул создаем связи между ближайшими атомами
        else {
            for (let i = 0; i < this.placedAtoms.length; i++) {
                for (let j = i + 1; j < this.placedAtoms.length; j++) {
                    const atom1 = this.placedAtoms[i];
                    const atom2 = this.placedAtoms[j];
                    
                    // Расстояние между атомами
                    const dx = atom2.x - atom1.x;
                    const dy = atom2.y - atom1.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Если атомы достаточно близко, создаем связь
                    if (distance < 100 && distance > 20) {
                        this.createConnectionElement(atom1, atom2);
                    }
                }
            }
        }
    }
    
    createConnectionElement(atom1, atom2, isDouble = false) {
        const connectionsDiv = document.getElementById('connections');
        if (!connectionsDiv) return;
        
        const connection = document.createElement('div');
        connection.className = `connection ${isDouble ? 'double' : 'single'}`;
        
        // Позиция и угол
        const dx = atom2.x - atom1.x;
        const dy = atom2.y - atom1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        connection.style.width = `${distance}px`;
        connection.style.left = `${atom1.x}px`;
        connection.style.top = `${atom1.y}px`;
        connection.style.transform = `rotate(${angle}deg)`;
        
        // Для двойной связи
        if (isDouble) {
            connection.style.height = '8px';
            connection.style.background = 'repeating-linear-gradient(to bottom, var(--dark) 0px, var(--dark) 2px, transparent 2px, transparent 4px, var(--dark) 4px, var(--dark) 6px, transparent 6px, transparent 8px)';
        }
        
        connectionsDiv.appendChild(connection);
        
        this.connections.push({
            atom1: atom1.symbol,
            atom2: atom2.symbol,
            isDouble: isDouble
        });
    }
    
    checkMolecule() {
        if (!this.gameActive) return;
        
        // Проверяем количество атомов
        const placedSymbols = this.placedAtoms.map(a => a.symbol);
        const targetSymbols = [...this.currentMolecule.atoms];
        
        // Сортируем для сравнения
        placedSymbols.sort();
        targetSymbols.sort();
        
        // Проверяем соответствие
        let correct = false;
        let message = "";
        let showFormula = false;
        
        if (placedSymbols.length !== targetSymbols.length) {
            message = `Неправильное количество атомов. Нужно: ${targetSymbols.length}, у вас: ${placedSymbols.length}`;
        } else if (JSON.stringify(placedSymbols) !== JSON.stringify(targetSymbols)) {
            message = "Неправильный состав атомов";
            
            // Даем подсказку о том, какие атомы неверны
            const wrongAtoms = this.findWrongAtoms(placedSymbols, targetSymbols);
            if (wrongAtoms.length > 0) {
                message += `. Проверьте атомы: ${wrongAtoms.join(', ')}`;
            }
        } else {
            // Дополнительная проверка для специфичных молекул
            correct = true;
            showFormula = true;
            message = "Молекула собрана правильно!";
            
            // Дополнительные сообщения для конкретных молекул
            switch(this.currentMolecule.formula) {
                case "H₂O":
                    message += " Вы создали воду - основу жизни на Земле!";
                    break;
                case "CO₂":
                    message += " Это углекислый газ, важный для фотосинтеза растений.";
                    break;
                case "NH₃":
                    message += " Аммиак - важное соединение в химической промышленности.";
                    break;
                case "CH₄":
                    message += " Метан - основной компонент природного газа.";
                    break;
                case "HCl":
                    message += " Соляная кислота - сильная кислота с важным применением.";
                    break;
                case "H₂O₂":
                    message += " Пероксид водорода - мощный антисептик и отбеливатель.";
                    break;
                case "C₆H₁₂O₆":
                    message += " Глюкоза - основной источник энергии для живых организмов!";
                    break;
                default:
                    message += " Отличная работа!";
            }
        }
        
        if (correct) {
            // Начисляем очки
            const timeBonus = Math.floor(this.timeLeft / 5);
            const levelBonus = this.level * 100;
            const difficultyBonus = this.getDifficultyBonus();
            const connectionBonus = this.connections.length * 25;
            
            const points = 200 + timeBonus + levelBonus + difficultyBonus + connectionBonus;
            this.score += points;
            this.currentLevelCompleted = true;
            
            // Обновляем рекорд
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('moleculeHighScore', this.highScore);
                this.loadHighScore();
            }
            
            // Останавливаем игру
            this.gameActive = false;
            clearInterval(this.timer);
            
            // Показываем формулу
            if (showFormula && this.currentMolecule.hiddenFormula) {
                this.revealFormula();
            }
            
            // Показываем успех
            this.showResult(true, points, message);
            
            // Разблокируем достижение
            if (typeof window.unlockAchievement === 'function') {
                if (this.level === 1) {
                    window.unlockAchievement('first_game');
                }
            }
        } else {
            // Штраф за неправильную сборку
            this.score = Math.max(0, this.score - 50);
            
            // Даем возможность увидеть формулу после нескольких попыток
            this.wrongAttempts = (this.wrongAttempts || 0) + 1;
            if (this.wrongAttempts >= 3) {
                this.offerHint();
            }
            
            this.showMessage(message, "error");
        }
        
        this.updateDisplay();
        this.updateNextButton();
    }
    
    revealFormula() {
        const formulaElement = document.querySelector('.formula');
        const targetDisplay = document.getElementById('targetDisplay');
        
        if (formulaElement && targetDisplay) {
            // Удаляем скрытую формулу
            formulaElement.classList.remove('hidden');
            formulaElement.innerHTML = this.currentMolecule.formula;
            
            // Удаляем уровень сложности
            const difficultyElement = targetDisplay.querySelector('.difficulty');
            if (difficultyElement) difficultyElement.remove();
            
            // Анимация раскрытия
            formulaElement.style.animation = 'reveal 1s ease';
            
            // Сохраняем, что формула раскрыта для этого уровня
            this.currentMolecule.hiddenFormula = false;
            this.saveLevelProgress();
            
            // Воспроизводим звук открытия
            this.playSound('reveal');
        }
    }
    
    getDifficultyBonus() {
        switch(this.currentMolecule.difficulty) {
            case 'easy': return 50;
            case 'medium': return 100;
            case 'hard': return 200;
            default: return 0;
        }
    }
    
    findWrongAtoms(placed, target) {
        const wrongAtoms = [];
        const placedCount = {};
        const targetCount = {};
        
        // Считаем атомы
        placed.forEach(atom => placedCount[atom] = (placedCount[atom] || 0) + 1);
        target.forEach(atom => targetCount[atom] = (targetCount[atom] || 0) + 1);
        
        // Находим различия
        for (const atom in placedCount) {
            if (placedCount[atom] !== targetCount[atom]) {
                wrongAtoms.push(atom);
            }
        }
        
        return wrongAtoms;
    }
    
    offerHint() {
        if (!this.hintOffered) {
            this.hintOffered = true;
            
            // Создаем кнопку подсказки
            const hintButton = document.createElement('button');
            hintButton.className = 'btn hint-offer-btn';
            hintButton.innerHTML = '<i class="fas fa-eye"></i> Показать формулу (-30 очков)';
            
            hintButton.onclick = () => {
                if (this.score >= 30) {
                    this.score -= 30;
                    this.revealFormula();
                    hintButton.remove();
                    this.updateDisplay();
                } else {
                    this.showMessage("Недостаточно очков для подсказки!", "warning");
                }
            };
            
            // Добавляем кнопку в игровую область
            const gameArea = document.querySelector('.game-area');
            if (gameArea) {
                const existingHint = gameArea.querySelector('.hint-offer-btn');
                if (!existingHint) {
                    gameArea.appendChild(hintButton);
                }
            }
        }
    }
    
    removeOldHints() {
        const hintButton = document.querySelector('.hint-offer-btn');
        if (hintButton) {
            hintButton.remove();
        }
    }
    
    showResult(success, points, message) {
        const modal = document.getElementById('resultModal');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const resultScore = document.getElementById('resultScore');
        const resultTime = document.getElementById('resultTime');
        const resultLevel = document.getElementById('resultLevel');
        
        if (!modal) return;
        
        if (success) {
            icon.className = 'result-icon success';
            icon.innerHTML = '<i class="fas fa-trophy"></i>';
            title.textContent = 'Уровень пройден!';
            resultMessage.textContent = message;
            
            // Добавляем дополнительную информацию
            const modalBody = document.querySelector('.modal-body');
            if (modalBody) {
                const existingDetails = modalBody.querySelector('.result-details');
                if (existingDetails) existingDetails.remove();
                
                const details = document.createElement('div');
                details.className = 'result-details';
                
                // Показываем формулу
                const formulaDisplay = document.createElement('div');
                formulaDisplay.className = 'correct-formula';
                formulaDisplay.textContent = `Правильная формула: ${this.currentMolecule.formula}`;
                details.appendChild(formulaDisplay);
                
                // Добавляем интересные факты
                if (this.currentMolecule.facts) {
                    const facts = document.createElement('div');
                    facts.className = 'molecule-facts';
                    facts.innerHTML = `
                        <h4><i class="fas fa-lightbulb"></i> Интересный факт</h4>
                        <p>${this.currentMolecule.facts}</p>
                    `;
                    details.appendChild(facts);
                }
                
                // Показываем структуру
                const structure = document.createElement('div');
                structure.className = 'molecule-facts';
                structure.innerHTML = `
                    <h4><i class="fas fa-atom"></i> Структура</h4>
                    <p>${this.currentMolecule.structure}</p>
                `;
                details.appendChild(structure);
                
                const resultStats = modalBody.querySelector('.result-stats');
                if (resultStats) {
                    modalBody.insertBefore(details, resultStats);
                } else {
                    modalBody.appendChild(details);
                }
            }
            
            // Сохраняем прогресс уровня
            this.saveLevelProgress();
        } else {
            icon.className = 'result-icon fail';
            icon.innerHTML = '<i class="fas fa-times-circle"></i>';
            title.textContent = 'Попробуй еще раз';
            resultMessage.textContent = message;
            
            // Показываем правильную формулу после 3 неудачных попыток
            if (this.wrongAttempts >= 3) {
                const modalBody = document.querySelector('.modal-body');
                if (modalBody) {
                    const existingFormula = modalBody.querySelector('.correct-formula');
                    if (!existingFormula) {
                        const formulaHint = document.createElement('div');
                        formulaHint.className = 'correct-formula';
                        formulaHint.textContent = `Подсказка: формула - ${this.currentMolecule.formula}`;
                        formulaHint.style.fontSize = '1rem';
                        formulaHint.style.opacity = '0.8';
                        
                        const resultStats = modalBody.querySelector('.result-stats');
                        if (resultStats) {
                            modalBody.insertBefore(formulaHint, resultStats);
                        } else {
                            modalBody.appendChild(formulaHint);
                        }
                    }
                }
            }
        }
        
        if (resultScore) resultScore.textContent = this.score;
        if (resultTime) resultTime.textContent = `${90 - this.timeLeft}с`;
        if (resultLevel) resultLevel.textContent = this.level;
        
        modal.classList.add('active');
    }
    
    saveLevelProgress() {
        const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
        if (!completedLevels.includes(this.level)) {
            completedLevels.push(this.level);
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
        }
    }
    
    canAccessLevel(level) {
        if (level === 1) return true;
        const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
        return completedLevels.includes(level - 1);
    }
    
    closeResultModal() {
        const modal = document.getElementById('resultModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    clearWorkspace() {
        if (!this.gameActive) return;
        
        this.placedAtoms = [];
        this.connections = [];
        
        const workspace = document.getElementById('constructionArea');
        if (workspace) {
            const atoms = workspace.querySelectorAll('.placed-atom');
            atoms.forEach(atom => atom.remove());
            
            const connections = document.getElementById('connections');
            if (connections) connections.innerHTML = '';
        }
        
        this.playSound('clear');
    }
    
    showHint() {
        if (!this.gameActive) return;
        
        // Штраф за подсказку
        this.score = Math.max(0, this.score - 30);
        
        const hint = this.currentMolecule.structure;
        this.showMessage(`Подсказка: ${hint}`, "hint");
        this.updateDisplay();
    }
    
    nextLevel() {
        if (!this.currentLevelCompleted) {
            this.showMessage("Сначала завершите текущий уровень!", "warning");
            return;
        }
        
        const nextLevel = this.level + 1;
        
        // Проверяем, можно ли перейти на следующий уровень
        if (!this.canAccessLevel(nextLevel)) {
            this.showMessage("Вы должны завершить предыдущий уровень!", "warning");
            return;
        }
        
        this.closeResultModal();
        
        if (nextLevel in this.moleculesByLevel) {
            this.startLevel(nextLevel);
        } else {
            this.showGameCompleted();
        }
    }
    
    showGameCompleted() {
        this.gameActive = false;
        clearInterval(this.timer);
        
        const modal = document.getElementById('resultModal');
        const icon = document.getElementById('resultIcon');
        const title = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');
        const resultScore = document.getElementById('resultScore');
        const resultTime = document.getElementById('resultTime');
        const resultLevel = document.getElementById('resultLevel');
        const nextBtn = document.getElementById('playAgainBtn');
        const backBtn = document.getElementById('backToMenuBtn');
        
        if (modal && icon && title && resultMessage && resultScore && resultTime && resultLevel) {
            icon.className = 'result-icon success';
            icon.innerHTML = '<i class="fas fa-crown"></i>';
            title.textContent = 'Поздравляем!';
            resultMessage.textContent = 'Вы прошли все уровни игры!';
            resultScore.textContent = this.score;
            resultTime.textContent = 'Завершено';
            resultLevel.textContent = 'Все';
            
            if (nextBtn) nextBtn.textContent = 'Начать заново';
            if (backBtn) backBtn.textContent = 'В главное меню';
            
            modal.classList.add('active');
        }
    }
    
    restartLevel() {
        this.closeResultModal();
        this.startLevel(this.level);
        this.score = Math.max(0, this.score - 100); // Штраф за перезапуск
        this.updateDisplay();
    }
    
    startTimer() {
        clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (!this.gameActive) return;
            
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
            
            // Мигание при малом времени
            if (this.timeLeft <= 10) {
                const timerElement = document.getElementById('timer');
                if (timerElement) {
                    timerElement.classList.toggle('blink');
                }
            }
        }, 1000);
    }
    
    gameOver() {
        clearInterval(this.timer);
        this.gameActive = false;
        this.showResult(false, 0, "Время вышло! Попробуйте еще раз.");
    }
    
    updateDisplay() {
        // Очки и уровень
        const scoreDisplay = document.getElementById('scoreDisplay');
        const levelDisplay = document.getElementById('levelDisplay');
        
        if (scoreDisplay) scoreDisplay.textContent = `Очки: ${this.score}`;
        if (levelDisplay) levelDisplay.textContent = `Уровень: ${this.level}`;
        
        // Таймер
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Цвет таймера при малом времени
            if (this.timeLeft < 30) {
                timerElement.style.color = '#ff6b6b';
            } else {
                timerElement.style.color = '';
            }
        }
    }
    
    updateNextButton() {
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            if (this.currentLevelCompleted) {
                nextBtn.disabled = false;
                nextBtn.classList.remove('disabled');
                nextBtn.innerHTML = '<i class="fas fa-forward"></i> Следующий уровень';
            } else {
                nextBtn.disabled = true;
                nextBtn.classList.add('disabled');
                nextBtn.innerHTML = '<i class="fas fa-lock"></i> Завершите уровень';
            }
        }
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
    
    playSound(type) {
        // Простая звуковая обратная связь
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'place':
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                    break;
                case 'move':
                    oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
                    break;
                case 'remove':
                    oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
                    break;
                case 'clear':
                    oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
                    break;
                case 'reveal':
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
                    break;
                default:
                    oscillator.frequency.setValueAtTime(440.00, audioContext.currentTime); // A4
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio не поддерживается, пропускаем
        }
    }
}

function initMoleculeGame() {
    window.game = new MoleculeGame();
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
    
    @keyframes reveal {
        0% {
            transform: scale(0.8);
            opacity: 0;
            filter: blur(10px);
        }
        50% {
            transform: scale(1.2);
            filter: blur(5px);
        }
        100% {
            transform: scale(1);
            opacity: 1;
            filter: blur(0);
        }
    }
    
    @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(1deg); }
        75% { transform: rotate(-1deg); }
    }
    
    .blink {
        animation: blink 1s infinite;
    }
    
    .btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
    }
    
    .btn.disabled:hover {
        transform: none !important;
        box-shadow: var(--shadow) !important;
    }
    
    .hidden-formula {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--accent2);
        letter-spacing: 10px;
        text-shadow: 0 0 10px rgba(255, 139, 148, 0.5);
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
    
    .formula.hidden {
        filter: blur(5px);
        transition: filter 0.5s ease;
    }
    
    .difficulty {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
    
    .difficulty.easy {
        background: rgba(46, 204, 113, 0.2);
        color: #27ae60;
        border: 2px solid #27ae60;
    }
    
    .difficulty.medium {
        background: rgba(255, 209, 102, 0.2);
        color: #f39c12;
        border: 2px solid #f39c12;
    }
    
    .difficulty.hard {
        background: rgba(231, 76, 60, 0.2);
        color: #c0392b;
        border: 2px solid #c0392b;
    }
    
    .composition-hint {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
        font-style: italic;
        background: rgba(168, 230, 207, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 10px;
        border-left: 3px solid var(--primary);
    }
    
    .description {
        font-size: 0.9rem;
        color: #666;
        margin-top: 0.5rem;
        font-style: italic;
    }
    
    .construction-area {
        min-height: 300px;
        position: relative;
        transition: all 0.3s ease;
    }
    
    .construction-area.active {
        border-color: var(--accent);
        background: rgba(255, 170, 165, 0.05);
    }
    
    .drop-zone {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #ccc;
        z-index: 1;
    }
    
    .placed-atom {
        position: absolute;
        z-index: 10;
        transition: box-shadow 0.3s ease;
    }
    
    .placed-atom:hover {
        box-shadow: 0 0 20px rgba(0,0,0,0.3) !important;
    }
    
    .connection {
        position: absolute;
        background: var(--dark);
        height: 4px;
        transform-origin: 0 0;
        z-index: 5;
        border-radius: 2px;
    }
    
    .connection::before,
    .connection::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background: var(--accent2);
        border-radius: 50%;
        top: -3px;
    }
    
    .connection::before {
        left: -5px;
    }
    
    .connection::after {
        right: -5px;
    }
    
    .connection.double {
        height: 8px;
        background: repeating-linear-gradient(
            to bottom,
            var(--dark) 0px,
            var(--dark) 2px,
            transparent 2px,
            transparent 4px,
            var(--dark) 4px,
            var(--dark) 6px,
            transparent 6px,
            transparent 8px
        );
    }
    
    .hint-offer-btn {
        margin-top: 1rem;
        background: linear-gradient(135deg, #3498db, #2980b9);
        animation: wiggle 2s infinite;
    }
    
    .result-details {
        margin: 1.5rem 0;
        padding: 1rem;
        background: rgba(168, 230, 207, 0.1);
        border-radius: 10px;
        border-left: 3px solid var(--primary);
    }
    
    .correct-formula {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--accent2);
        text-align: center;
        margin: 1rem 0;
        padding: 0.5rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .molecule-facts {
        text-align: left;
        margin-top: 1.5rem;
        padding: 1rem;
        background: linear-gradient(135deg, rgba(255, 170, 165, 0.1), rgba(220, 237, 193, 0.1));
        border-radius: 10px;
    }
    
    .molecule-facts h4 {
        color: var(--accent2);
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .molecule-facts p {
        color: #666;
        line-height: 1.6;
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
    
    .game-message.error {
        background: #ff6b6b;
    }
    
    .game-message.warning {
        background: #ffd166;
        color: var(--dark);
    }
    
    .game-message.hint {
        background: #4ecdc4;
    }
    
    .game-message.success {
        background: #2ecc71;
    }
`;
document.head.appendChild(gameStyles);